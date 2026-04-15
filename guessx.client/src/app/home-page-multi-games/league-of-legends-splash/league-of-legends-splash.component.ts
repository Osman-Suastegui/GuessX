import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { mapApiResponseToCharacter } from '../../utils/character-mapper';
import { SplashAnswer, SplashGuessComponent } from '../components/splash-guess/splash-guess.component';
import { Character, CharacterLeagueOfLegends } from '../interfaces';

@Component({
  selector: 'app-league-of-legends-splash',
  standalone: true,
  imports: [SplashGuessComponent],
  templateUrl: './league-of-legends-splash.component.html',
  styleUrl: './league-of-legends-splash.component.css',
})
export class LeagueOfLegendsSplashComponent implements OnInit {
  public answerCharacterSplash = {
    name: '',
    splash: '',
  };

  public solvedCharacterName: string = '';
  public searchResults: CharacterLeagueOfLegends[] = [];

  private readonly searchTerms: Subject<string> = new Subject<string>();

  constructor(
    private readonly charactersService: CharactersService,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.getSplashOfTheDay();
    this.bindSearch();
  }

  public onAnswerGuessed(answer: SplashAnswer): void {
    this.solvedCharacterName = String((answer as Record<string, unknown>)['name'] ?? 'Unknown');
  }

  public onSearchTermChanged(term: string): void {
    this.searchTerms.next(term);
  }

  private bindSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const cleanedTerm: string = term.trim();
          return this.charactersService.getCharacter(cleanedTerm).pipe(
            map((characters: Character[]) => characters.map((character) => mapApiResponseToCharacter(character))),
            catchError(() => of([] as CharacterLeagueOfLegends[])),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((characters) => {
        this.searchResults = characters;
      });
  }

  getSplashOfTheDay(): void {
    this.charactersService.getSplashOfTheDay(1).subscribe((splash) => {
      this.answerCharacterSplash = {
        name: splash.name,
        splash: splash.splashImageUrl,
      };
    });
  }
}
