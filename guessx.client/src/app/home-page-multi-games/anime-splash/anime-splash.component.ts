import { Component, OnInit } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { Anime } from '../interfaces';
import { SplashAnswer, SplashGuessComponent } from '../components/splash-guess/splash-guess.component';
@Component({
  selector: 'app-anime-splash',
  standalone: true,
  imports: [SplashGuessComponent],
  templateUrl: './anime-splash.component.html',
  styleUrl: './anime-splash.component.css',
})
export class AnimeSplashComponent implements OnInit {
  answerCharacterSplash = {
    name: '',
    splash: '',
  };
  public searchResults: Anime[] = [];
  public solvedCharacterName: string = '';

  private readonly searchTerms: Subject<string> = new Subject<string>();

  constructor(private charactersService: CharactersService) {}
  ngOnInit(): void {
    this.getSplashOfTheDay();
    this.bindSearch();
  }

  public onAnswerGuessed(answer: SplashAnswer): void {
    this.solvedCharacterName = String((answer as Record<string, unknown>)['name'] ?? 'Unknown');
  }

  public onSearchTermChanged(term: string): void {
    this.searchTerms.next(term);
  }

  getSplashOfTheDay() {
    this.charactersService.getSplashOfTheDayAnime().subscribe((splash) => {
      this.answerCharacterSplash = {
        name: splash.name,
        splash: splash.splashImageUrl,
      };
    });
  }

  private bindSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const cleanedTerm: string = term.trim();
          return this.charactersService.getAnimes(cleanedTerm).pipe(catchError(() => of([] as Anime[])));
        }),
      )
      .subscribe((animes) => {
        this.searchResults = animes;
      });
  }
}
