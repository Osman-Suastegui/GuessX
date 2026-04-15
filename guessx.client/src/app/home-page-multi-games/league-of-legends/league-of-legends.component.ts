import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap, tap } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { mapApiResponseToCharacter } from '../../utils/character-mapper';
import { GuessData, GuessGridColumn, GuessResultsGridComponent } from '../components/guess-results-grid/guess-results-grid.component';
import { SearchAutocompleteComponent, SearchOption } from '../components/search-autocomplete/search-autocomplete.component';
import { Character, CharacterLeagueOfLegends } from '../interfaces';

@Component({
  selector: 'app-league-of-legends',
  templateUrl: './league-of-legends.component.html',
  styleUrl: './league-of-legends.component.css',
  standalone: true,
  imports: [GuessResultsGridComponent, SearchAutocompleteComponent],
})
export class LeagueOfLegendsComponent implements OnInit {
  public answerCharacter: CharacterLeagueOfLegends = {
    id: '',
    name: '',
    gender: '',
    position: '',
    class: '',
    resource: '',
    rangeType: '',
    releaseYear: 1,
    role: '',
    imageUrl: '',
  };

  public readonly tableColumns: readonly GuessGridColumn[] = [
    { key: 'gender', label: 'Gender', icon: 'G' },
    { key: 'role', label: 'Role', icon: 'ROL', valueType: 'set', delimiter: '/' },
    { key: 'class', label: 'Class', icon: 'CLS' },
    {
      key: 'resource',
      label: 'Resource',
    },
    {
      key: 'rangeType',
      label: 'Range Type',
    },
    { key: 'releaseYear', label: 'Release Year', icon: 'REL' },
  ];

  public guessedCharacters: CharacterLeagueOfLegends[] = [];

  public searchTerm: string = '';
  public isSearching: boolean = false;
  public searchResults: readonly CharacterLeagueOfLegends[] = [];
  public guessedCharacterName: string = '';

  private readonly searchTerms: Subject<string> = new Subject<string>();

  constructor(
    private characterService: CharactersService,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.getCharacterOfTheDay();
    this.onSearch();
  }

  public onSearchInput(term: string): void {
    this.searchTerm = term;

    if (term.trim().length === 0) {
      this.searchResults = [];
      this.isSearching = false;
      return;
    }

    this.searchTerms.next(term);
  }

  public selectCharacter(character: CharacterLeagueOfLegends): void {
    this.guessedCharacters = [...this.guessedCharacters, { ...character }];
    this.searchTerm = '';
    this.searchResults = [];
    this.isSearching = false;
  }

  public selectCharacterOption(option: SearchOption): void {
    this.selectCharacter(option as CharacterLeagueOfLegends);
  }

  public onCharacterGuessed(character: GuessData): void {
    this.guessedCharacterName = String((character as Record<string, unknown>)['name'] ?? 'Unknown');
  }

  onSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.isSearching = true;
        }),
        switchMap((term) => {
          const cleanedTerm: string = term.trim();

          return this.characterService.getCharacter(cleanedTerm).pipe(catchError(() => of([] as Character[])));
        }),
        map((characters) => {
          return characters.map((character) => mapApiResponseToCharacter(character));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((mappedCharacters) => {
        this.searchResults = mappedCharacters;
        this.isSearching = false;
      });
  }

  private getCharacterOfTheDay(): void {
    this.characterService
      .getCharacterOfTheDay(1) // Assuming 1 is the gameId for League of Legends
      .pipe(map((character) => mapApiResponseToCharacter(character)))
      .subscribe((character: CharacterLeagueOfLegends) => {
        this.answerCharacter = character;
      });
  }
}
