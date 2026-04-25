import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SearchAutocompleteComponent, SearchOption } from '../search-autocomplete/search-autocomplete.component';

export type AnimeClueAnswer = object;

type AnimeClueValueMap = Record<string, unknown>;

interface GuessSelection {
  name: string;
  imageUrl: string;
}

interface ClueStage {
  index: number;
  label: string;
  imageUrl: string;
  unlocked: boolean;
  wrongGuessesLeft: number;
}

@Component({
  selector: 'app-anime-clue-guess',
  standalone: true,
  imports: [NgClass, SearchAutocompleteComponent],
  templateUrl: './anime-clue-guess.component.html',
  styleUrl: './anime-clue-guess.component.css',
})
export class AnimeClueGuessComponent implements OnChanges {
  @Input({ required: true }) public answerCharacter: AnimeClueAnswer | null = null;
  @Input() public answerKey: string = 'name';
  @Input() public stageImages: readonly string[] = [];
  @Input() public stageImagesKey: string = 'splashStages';
  @Input() public searchResults: readonly AnimeClueAnswer[] = [];
  @Input() public searchResultKey: string = 'name';
  @Input() public heading: string = 'Guess the anime';
  @Input() public subtitle: string = 'Unlock extra clues after wrong guesses.';
  @Input() public placeholder: string = 'Guess the anime title...';
  @Input() public originalStageLabel: string = 'Original Screen';
  @Input() public firstClueLabel: string = 'First Clue';
  @Input() public secondClueLabel: string = 'Second Clue';
  @Input() public firstClueUnlockWrongGuesses: number = 3;
  @Input() public secondClueUnlockWrongGuesses: number = 6;

  @Output() public answerGuessed: EventEmitter<AnimeClueAnswer> = new EventEmitter<AnimeClueAnswer>();
  @Output() public searchTermChanged: EventEmitter<string> = new EventEmitter<string>();

  public guessInput: GuessSelection | null = null;
  public guessSearchTerm: string = '';
  public previousGuesses: GuessSelection[] = [];
  public solved: boolean = false;
  public hideSearchResults: boolean = false;
  public selectedStageIndex: number = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['answerCharacter'] || changes['stageImages']) {
      this.resetGameState();
    }
  }

  public submitGuess(): void {
    const guess: GuessSelection | null = this.guessInput;
    if (!guess || this.solved || !this.answerCharacter) {
      return;
    }

    const guessName: string = guess.name.trim();
    if (guessName.length === 0) {
      return;
    }

    this.hideSearchResults = true;
    this.previousGuesses = [{ name: guessName, imageUrl: guess.imageUrl }, ...this.previousGuesses];
    this.guessInput = null;
    this.guessSearchTerm = '';
    this.searchTermChanged.emit('');

    if (this.isGuessCorrect({ name: guessName, imageUrl: guess.imageUrl })) {
      this.solved = true;
      this.answerGuessed.emit(this.answerCharacter);
    }
  }

  public selectClueStage(index: number): void {
    const selectedStage: ClueStage | undefined = this.clueStages.find((stage) => stage.index === index);
    if (!selectedStage || !selectedStage.unlocked) {
      return;
    }

    this.selectedStageIndex = selectedStage.index;
  }

  public onGuessInput(term: string): void {
    this.guessSearchTerm = term;
    this.hideSearchResults = false;
    this.searchTermChanged.emit(term.trim());
  }

  public selectSearchResult(item: SearchOption): void {
    const selectedName: string = String(this.getValue(item as AnimeClueAnswer, this.searchResultKey) ?? '');
    const selectedImage: string = String(this.getValue(item as AnimeClueAnswer, 'imageUrl') ?? '');

    this.guessInput = {
      name: selectedName,
      imageUrl: selectedImage,
    };
    this.guessSearchTerm = selectedName;
    this.hideSearchResults = true;
    this.searchTermChanged.emit('');
  }

  public isGuessCorrect(guess: GuessSelection): boolean {
    const normalizedAnswer: string = this.answerName.trim().toLowerCase();

    return normalizedAnswer.length > 0 && guess.name.trim().toLowerCase() === normalizedAnswer;
  }

  public get attemptsUsed(): number {
    return this.previousGuesses.length;
  }

  public get wrongGuessesCount(): number {
    return this.previousGuesses.reduce((count, guess) => (this.isGuessCorrect(guess) ? count : count + 1), 0);
  }

  public get shouldShowSearchResults(): boolean {
    return !!(
      !this.hideSearchResults &&
      !this.solved &&
      this.guessSearchTerm.trim().length > 0 &&
      this.searchResults.length > 0
    );
  }

  public get answerName(): string {
    return String(this.getValue(this.answerCharacter, this.answerKey) ?? 'Unknown');
  }

  public get activeStageImage(): string {
    const selectedStage: ClueStage | undefined = this.clueStages.find((stage) => stage.index === this.selectedStageIndex);
    if (!selectedStage || !selectedStage.unlocked) {
      return this.clueStages[0]?.imageUrl ?? '';
    }

    return selectedStage.imageUrl;
  }

  public get activeStageAlt(): string {
    const selectedStage: ClueStage | undefined = this.clueStages.find((stage) => stage.index === this.selectedStageIndex);
    const stageLabel: string = selectedStage?.label ?? this.originalStageLabel;

    return `${stageLabel} for ${this.answerName}`;
  }

  public get firstClueRemainingWrongGuesses(): number {
    return this.getRemainingWrongGuesses(this.firstClueUnlockWrongGuesses);
  }

  public get secondClueRemainingWrongGuesses(): number {
    return this.getRemainingWrongGuesses(this.secondClueUnlockWrongGuesses);
  }

  public get clueProgressText(): string {
    if (this.firstClueRemainingWrongGuesses > 0) {
      return `First clue unlocks in ${this.firstClueRemainingWrongGuesses} wrong guesses.`;
    }

    if (this.secondClueRemainingWrongGuesses > 0) {
      return `Second clue unlocks in ${this.secondClueRemainingWrongGuesses} wrong guesses.`;
    }

    return 'All clues are unlocked.';
  }

  public get clueStages(): ClueStage[] {
    const normalizedImages: string[] = this.getNormalizedStageImages();

    return [
      {
        index: 0,
        label: this.originalStageLabel,
        imageUrl: normalizedImages[0],
        unlocked: true,
        wrongGuessesLeft: 0,
      },
      {
        index: 1,
        label: this.firstClueLabel,
        imageUrl: normalizedImages[1],
        unlocked: this.firstClueRemainingWrongGuesses === 0,
        wrongGuessesLeft: this.firstClueRemainingWrongGuesses,
      },
      {
        index: 2,
        label: this.secondClueLabel,
        imageUrl: normalizedImages[2],
        unlocked: this.secondClueRemainingWrongGuesses === 0,
        wrongGuessesLeft: this.secondClueRemainingWrongGuesses,
      },
    ];
  }

  private getRemainingWrongGuesses(targetWrongGuesses: number): number {
    const normalizedTarget: number = Math.max(targetWrongGuesses, 0);

    return Math.max(normalizedTarget - this.wrongGuessesCount, 0);
  }

  private getNormalizedStageImages(): string[] {
    const explicitImages: string[] = this.stageImages
      .map((imageUrl) => imageUrl.trim())
      .filter((imageUrl) => imageUrl.length > 0);

    const sourceImages: string[] = explicitImages.length > 0 ? explicitImages : this.resolveStageImagesFromAnswer();

    const fallbackImage: string = String(this.getValue(this.answerCharacter, 'splash') ?? '').trim();
    const initialImages: string[] = sourceImages.length > 0 ? sourceImages : [fallbackImage];
    const normalizedImages: string[] = [];

    for (let index = 0; index < 3; index += 1) {
      normalizedImages.push(initialImages[index] ?? initialImages[initialImages.length - 1] ?? '');
    }

    return normalizedImages;
  }

  private resolveStageImagesFromAnswer(): string[] {
    const candidateImages: unknown = this.getValue(this.answerCharacter, this.stageImagesKey);
    if (!Array.isArray(candidateImages)) {
      return [];
    }

    return candidateImages.map((imageUrl) => String(imageUrl ?? '').trim()).filter((imageUrl) => imageUrl.length > 0);
  }

  private resetGameState(): void {
    this.guessInput = null;
    this.guessSearchTerm = '';
    this.previousGuesses = [];
    this.solved = false;
    this.hideSearchResults = false;
    this.selectedStageIndex = 0;
  }

  private getValue(source: AnimeClueAnswer | null, key: string): unknown {
    if (!source || key.trim().length === 0) {
      return undefined;
    }

    return (source as AnimeClueValueMap)[key];
  }
}
