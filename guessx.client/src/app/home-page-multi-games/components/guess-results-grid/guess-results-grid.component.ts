import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export type GuessCellState = 'correct' | 'partial' | 'wrong';

export type GuessValue = string | number | boolean | null | undefined;

export type GuessData = object;

type GuessValueMap = Record<string, GuessValue>;

export interface GuessGridColumn {
  readonly key: string;
  readonly label: string;
  readonly icon?: string;
  readonly valueType?: 'text' | 'set';
  readonly delimiter?: string;
}

interface GuessGridCell {
  readonly value: string;
  readonly icon?: string;
  readonly state: GuessCellState;
}

interface GuessGridRow {
  readonly guessNumber: number;
  readonly guessName: string;
  readonly cells: readonly GuessGridCell[];
}

@Component({
  selector: 'app-guess-results-grid',
  templateUrl: './guess-results-grid.component.html',
  styleUrl: './guess-results-grid.component.css',
  standalone: true,
  imports: [NgClass],
})
export class GuessResultsGridComponent implements OnChanges {
  @Input({ required: true }) public columns: readonly GuessGridColumn[] = [];
  @Input({ required: true }) public answer: GuessData | null = null;
  @Input({ required: true }) public guesses: GuessData[] = [];
  @Input() public guessLabelKey: string = 'name';

  @Output() public characterGuessed: EventEmitter<GuessData> = new EventEmitter<GuessData>();

  public computedRows: readonly GuessGridRow[] = [];

  private alreadyEmitted: boolean = false;


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['answer']) {
      this.alreadyEmitted = false;
    }

    this.computedRows = this.buildRows();
    this.emitWinnerIfNeeded();
  }

  public cellClass(state: GuessCellState): string {
    if (state === 'correct') {
      return 'cell-correct';
    }

    if (state === 'partial') {
      return 'cell-partial';
    }

    return 'cell-wrong';
  }

  private buildRows(): readonly GuessGridRow[] {
    return this.guesses.map((guess, index) => {
      const guessName: string = this.toDisplayValue(this.getValue(guess, this.guessLabelKey));

      return {
        guessNumber: index + 1,
        guessName,
        cells: this.columns.map((column) => this.buildCell(column, guess)),
      };
    });
  }

  private buildCell(column: GuessGridColumn, guess: GuessData): GuessGridCell {
    const guessValue: GuessValue = this.getValue(guess, column.key);
    const answerValue: GuessValue = this.getValue(this.answer, column.key);

    return {
      icon: column.icon,
      value: this.toDisplayValue(guessValue),
      state: this.resolveState(guessValue, answerValue, column),
    };
  }

  private resolveState(guessValue: GuessValue, answerValue: GuessValue, column: GuessGridColumn): GuessCellState {
    if (guessValue === null || guessValue === undefined || answerValue === null || answerValue === undefined) {
      return 'wrong';
    }

    const guessText: string = String(guessValue).trim().toLowerCase();
    const answerText: string = String(answerValue).trim().toLowerCase();

    if (guessText === answerText) {
      return 'correct';
    }

    if (column.valueType === 'set') {
      const delimiter: string = column.delimiter ?? '/';
      const guessTokens: string[] = guessText
        .split(delimiter)
        .map((token) => token.trim())
        .filter(Boolean);
      const answerTokens: string[] = answerText
        .split(delimiter)
        .map((token) => token.trim())
        .filter(Boolean);

      if (guessTokens.some((token) => answerTokens.includes(token))) {
        return 'partial';
      }
    }

    return 'wrong';
  }

  private emitWinnerIfNeeded(): void {
    if (this.alreadyEmitted || !this.answer || this.columns.length === 0) {
      return;
    }

    const winner: GuessData | undefined = this.guesses.find((guess) =>
      this.columns.every(
        (column) => this.resolveState(this.getValue(guess, column.key), this.getValue(this.answer, column.key), column) === 'correct',
      ),
    );

    if (!winner) {
      return;
    }

    this.alreadyEmitted = true;
    this.characterGuessed.emit(winner);
  }

  private toDisplayValue(value: GuessValue): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  private getValue(source: GuessData | null, key: string): GuessValue {
    if (!source) {
      return undefined;
    }

    return (source as GuessValueMap)[key];
  }
}
