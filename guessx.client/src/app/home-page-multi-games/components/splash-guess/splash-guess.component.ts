import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';

export type SplashAnswer = object;

type SplashValueMap = Record<string, unknown>;

interface PreviousGuess {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-splash-guess',
  standalone: true,
  imports: [NgClass, SearchAutocompleteComponent],
  templateUrl: './splash-guess.component.html',
  styleUrl: './splash-guess.component.css',
})
export class SplashGuessComponent implements OnChanges {
  @Input({ required: true }) public answerCharacter: SplashAnswer | null = null;
  @Input() public answerKey: string = 'name';
  @Input() public splashKey: string = 'splash';
  @Input() public enableZoom: boolean = true;
  @Input() public searchResults: readonly SplashAnswer[] = [];
  @Input() public searchResultKey: string = 'name';
  @Input() public maxAttempts: number = 5;
  @Input() public heading: string = 'Who is this?';
  @Input() public subtitle: string = 'Identify the character from this splash art fragment.';
  @Input() public placeholder: string = 'Guess the character...';

  @Output() public answerGuessed: EventEmitter<SplashAnswer> = new EventEmitter<SplashAnswer>();
  @Output() public searchTermChanged: EventEmitter<string> = new EventEmitter<string>();

  public guessInput: PreviousGuess | null = null;
  public guessSearchTerm: string = '';
  public previousGuesses: PreviousGuess[] = [];
  public solved: boolean = false;
  public hideSearchResults: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['answerCharacter']) {
      this.resetGameState();
    }
  }

  public submitGuess(): void {
    const guess: PreviousGuess | null = this.guessInput;
    if (!guess || this.solved || !this.answerCharacter) {
      return;
    }

    this.hideSearchResults = true;
    this.previousGuesses = [{ name: guess.name, imageUrl: guess.imageUrl }, ...this.previousGuesses];
    this.guessInput = null;
    this.guessSearchTerm = '';
    this.searchTermChanged.emit('');

    if (this.isGuessCorrect(guess)) {
      this.solved = true;
      this.answerGuessed.emit(this.answerCharacter);
    }
  }

  public get attemptsUsed(): number {
    return this.previousGuesses.length;
  }

  public get revealScale(): number {
    if (!this.enableZoom) {
      return 1;
    }

    if (this.solved) {
      return 1;
    }

    if (this.maxAttempts <= 0) {
      return 1;
    }

    const startScale: number = 2.4;
    const revealProgress: number = Math.min(this.attemptsUsed / this.maxAttempts, 1);

    return Number((startScale - (startScale - 1) * revealProgress).toFixed(2));
  }

  public get splashImage(): string {
    return String(this.getValue(this.answerCharacter, this.splashKey) ?? '');
  }

  public get answerName(): string {
    return String(this.getValue(this.answerCharacter, this.answerKey) ?? 'Unknown');
  }

  public isGuessCorrect(guess: PreviousGuess): boolean {
    const normalizedAnswer: string = this.answerName.trim().toLowerCase();

    return normalizedAnswer.length > 0 && guess.name.trim().toLowerCase() === normalizedAnswer;
  }

  public onGuessInput(term: string): void {
    this.guessSearchTerm = term;
    this.hideSearchResults = false;
    this.searchTermChanged.emit(term.trim());
  }
  public selectSearchResult(item: any): void {
    this.guessInput = item;
    this.guessSearchTerm = item.name || '';
    this.hideSearchResults = true;
    this.searchTermChanged.emit('');
  }

  public get shouldShowSearchResults(): boolean {
    return !!(
      !this.hideSearchResults &&
      !this.solved &&
      this.guessSearchTerm.trim().length > 0 &&
      this.searchResults.length > 0
    );
  }

  private resetGameState(): void {
    this.guessInput = null;
    this.previousGuesses = [];
    this.solved = false;
    this.hideSearchResults = false;
  }

  private getValue(source: SplashAnswer | null, key: string): unknown {
    if (!source) {
      return undefined;
    }

    return (source as SplashValueMap)[key];
  }
}
