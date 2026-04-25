import { Component, OnInit } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { Anime, SplashOfTheDay } from '../interfaces';
import { AnimeClueAnswer, AnimeClueGuessComponent } from '../components/anime-clue-guess/anime-clue-guess.component';

interface AnimeSplashAnswer {
  name: string;
  splashStages: string[];
}

@Component({
  selector: 'app-anime-splash',
  standalone: true,
  imports: [AnimeClueGuessComponent],
  templateUrl: './anime-splash.component.html',
  styleUrl: './anime-splash.component.css',
})
export class AnimeSplashComponent implements OnInit {
  public answerCharacterSplash: AnimeSplashAnswer = {
    name: '',
    splashStages: [],
  };

  public searchResults: Anime[] = [];
  public solvedCharacterName: string = '';

  private readonly searchTerms: Subject<string> = new Subject<string>();
  private readonly fallbackClueImages: readonly string[] = [
    'https://placehold.co/900x900/111624/f1f3f9?text=First+Clue',
    'https://placehold.co/900x900/111624/f1f3f9?text=Second+Clue',
  ];

  private readonly localClueImageMap: Record<string, readonly string[]> = {
    // Add per-anime clue URLs here until backend clue images are available.
  };

  constructor(private charactersService: CharactersService) {}
  ngOnInit(): void {
    this.getSplashOfTheDay();
    this.bindSearch();
  }

  public onAnswerGuessed(answer: AnimeClueAnswer): void {
    this.solvedCharacterName = String((answer as Record<string, unknown>)['name'] ?? 'Unknown');
  }

  public onSearchTermChanged(term: string): void {
    this.searchTerms.next(term);
  }

  public getSplashOfTheDay(): void {
    this.charactersService.getSplashOfTheDayAnime().subscribe((splash) => {
      this.answerCharacterSplash = {
        name: splash.name,
        splashStages: this.buildStageImages(splash),
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

  private buildStageImages(splash: SplashOfTheDay): string[] {
    const originalImage: string = splash.splashImageUrl.trim();
    const apiClues: string[] = (splash.clueImageUrls ?? [])
      .map((imageUrl) => imageUrl.trim())
      .filter((imageUrl) => imageUrl.length > 0);
    const localClues: string[] = [...(this.localClueImageMap[splash.name] ?? [])]
      .map((imageUrl) => imageUrl.trim())
      .filter((imageUrl) => imageUrl.length > 0);
    const clueImages: string[] = apiClues.length > 0 ? apiClues : (localClues.length > 0 ? localClues : [...this.fallbackClueImages]);

    const stageImages: string[] = [originalImage, ...clueImages].filter((imageUrl) => imageUrl.length > 0);
    if (stageImages.length === 0) {
      return [];
    }

    while (stageImages.length < 3) {
      stageImages.push(stageImages[stageImages.length - 1]);
    }

    return stageImages.slice(0, 3);
  }
}
