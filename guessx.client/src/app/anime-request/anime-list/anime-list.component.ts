import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Anime, AnimeSearchResponse } from '../anime.model';
import { AnimeServiceService } from '../anime-service.service';
import { debounceTime, merge } from 'rxjs';

@Component({
  selector: 'app-anime-list',
  templateUrl: './anime-list.component.html',
  styleUrl: './anime-list.component.css'
})
export class AnimeListComponent implements AfterViewInit {
  animeList: Anime[] = [];
  pagination: any;
  form: FormGroup

  types = ['tv', 'movie', 'ova', 'special', 'ona', 'music', 'cm', 'pv', 'tv_special'];
  statuses = ['airing', 'complete', 'upcoming'];

  constructor(private fb: FormBuilder, private animeService: AnimeServiceService) {
    this.form = this.fb.group({
      q: [''],
      type: [''],
      status: [''],
      page: [1],
      limit: [20]
    });
  }


  ngOnInit() {
    this.loadAnime();
  }

  ngAfterViewInit(): void {
    this.setSearchBarListener();
    this.initFilterListeners();
  }

  private setSearchBarListener() {
    this.form.get('q')?.valueChanges.pipe(debounceTime(300)).subscribe((value: string) => {
      this.form.patchValue({ page: 1 }, { emitEvent: false });
      this.loadAnime();
    });
  }

  private initFilterListeners() {
    merge(
      this.form.get('type')!.valueChanges,
      this.form.get('status')!.valueChanges,
      this.form.get('page')!.valueChanges,
    ).subscribe(() => this.loadAnime());
  }

  loadAnime() {
    const query = this.form.value;
    this.animeService.getAnimeList(query).subscribe((res: AnimeSearchResponse) => {
      console.log(res);
      this.animeList = res.data;
      this.pagination = res.pagination;
    });
  }

  changePage(page: number) {
    this.form.patchValue({ page });
    this.loadAnime();
  }
}
