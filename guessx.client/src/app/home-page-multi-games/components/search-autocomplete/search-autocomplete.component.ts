import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type SearchOption = object;

type SearchValueMap = Record<string, unknown>;

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css',
})
export class SearchAutocompleteComponent {
  @Input() public inputId: string = 'search-autocomplete-input';
  @Input() public label: string = 'Search';
  @Input() public placeholder: string = 'Search...';
  @Input() public term: string = '';
  @Input() public disabled: boolean = false;
  @Input() public results: readonly SearchOption[] = [];
  @Input() public displayKey: string = 'name';
  @Input() public imageKey: string = '';
  @Input() public showResults: boolean = true;
  @Input() public actionLabel: string = '';
  @Input() public actionDisabled: boolean = false;

  @Output() public termChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() public optionSelected: EventEmitter<SearchOption> = new EventEmitter<SearchOption>();
  @Output() public enterPressed: EventEmitter<void> = new EventEmitter<void>();
  @Output() public actionClicked: EventEmitter<void> = new EventEmitter<void>();

  public isOpen: boolean = false;

  constructor(private readonly hostElement: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target: Node | null = event.target as Node | null;
    if (!target) {
      return;
    }

    const clickedInside: boolean = this.hostElement.nativeElement.contains(target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  public onFocus(): void {
    this.isOpen = true;
  }

  public onInput(term: string): void {
    this.isOpen = true;
    this.termChanged.emit(term);
  }

  public onEnter(): void {
    this.enterPressed.emit();
  }

  public onActionClick(): void {
    this.actionClicked.emit();
  }

  public selectOption(option: SearchOption): void {
    this.isOpen = false;
    this.optionSelected.emit(option);
  }

  public get shouldRenderResults(): boolean {
    return this.showResults && this.isOpen && this.term.trim().length > 0 && this.results.length > 0;
  }

  public get hasAction(): boolean {
    return this.actionLabel.trim().length > 0;
  }

  public get shouldShowImage(): boolean {
    return this.imageKey.trim().length > 0;
  }

  public getOptionLabel(option: SearchOption): string {
    return this.toDisplayValue(this.getValue(option, this.displayKey));
  }

  public getOptionImage(option: SearchOption): string {
    return this.toDisplayValue(this.getValue(option, this.imageKey));
  }

  public trackOption(_index: number, option: SearchOption): string {
    const explicitId: string = this.toDisplayValue(this.getValue(option, 'id'));
    if (explicitId.length > 0) {
      return explicitId;
    }

    return `${this.getOptionLabel(option)}-${_index}`;
  }

  private toDisplayValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private getValue(source: SearchOption, key: string): unknown {
    if (!source || key.trim().length === 0) {
      return undefined;
    }

    return (source as SearchValueMap)[key];
  }
}
