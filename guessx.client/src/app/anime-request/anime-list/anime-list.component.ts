import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Anime, AnimeSearchResponse, TitleData } from '../anime.model';
import { JikanService } from '../jikan.service';
import { debounceTime, merge } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { AnimeImagesComponent } from '../anime-details/anime-images.component';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-list',
  templateUrl: './anime-list.component.html',
  styleUrl: './anime-list.component.css'
})
export class AnimeListComponent implements AfterViewInit, OnInit {
  animeList: Anime[] = [];
  pagination: any;
  form: FormGroup
  dialog = inject(MatDialog)
  savedAnime: TitleData[] = [];
  archviedAnime: TitleData[] = [];
  activeTab:FormControl = new FormControl('all');

  types = ['tv', 'movie', 'ova', 'special', 'ona', 'music', 'cm', 'pv', 'tv_special'];
  statuses = ['airing', 'complete', 'upcoming'];

  constructor
  (
    public fb: FormBuilder,
    private _jikanService: JikanService,
    private _animeService: AnimeService,
  ) {
    this.form = this.fb.group({
      q: [''],
      type: [''],
      status: [''],
      page: [1],
      limit: [20]
    });

  }


  ngOnInit() {
    this.loadJikanAnime();
    this.activeTab.valueChanges.subscribe((value: string) => {
      if (value === 'saved') {
        this.loadAnime();
      }
      if (value === 'archived') {
        this.loadArchivedAnime();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setSearchBarListener();
    this.initFilterListeners();
  }

  private setSearchBarListener() {
    this.form.get('q')?.valueChanges.pipe(debounceTime(300)).subscribe((value: string) => {
      if(this.activeTab.value === 'saved') {
        // HACE FALTA LA IMPLEMENTACION DE LA BUSQUEDA EN EL BACKEND
      }

      if(this.activeTab.value === 'all') {
        this.form.patchValue({ page: 1 }, { emitEvent: false });
        this.loadJikanAnime();
      }
    });
  }

  private initFilterListeners() {
    merge(
      this.form.get('type')!.valueChanges,
      this.form.get('status')!.valueChanges,
      this.form.get('page')!.valueChanges,
    ).subscribe(() => this.loadJikanAnime());
  }

  loadJikanAnime() {
    const query = this.form.value;
    this._jikanService.getAnimeList(query).subscribe((res: AnimeSearchResponse) => {
      console.log(res);
      this.animeList = res.data;
      this.pagination = res.pagination;
    });
  }

  loadAnime(): void {
    this._animeService.getAnimeRequests({}).subscribe((res: TitleData[]) => {
      this.savedAnime = res.filter(anime => anime.status !== 'Archived');
    });
  }

  loadArchivedAnime(): void {
    this._animeService.getAnimeRequests({'status':'Archived'},true).subscribe((res: TitleData[]) => {
      this.archviedAnime = res;
    });
  }

selectSavedAnime(anime: TitleData | Anime) {
  const dialogRef = this.dialog.open(AnimeImagesComponent, {
    data: anime,
    width: '90%',
    maxWidth: '1920px',
    height: '100%',
    maxHeight: '1080px',
    panelClass: 'custom-dialog-container',
    backdropClass: 'custom-backdrop',
  });

  dialogRef.afterClosed().subscribe(() => {
    this.loadAnime();
    this.loadArchivedAnime();
  });
}

  changePage(page: number) {
    this.form.patchValue({ page });
    this.loadJikanAnime();
  }

}
