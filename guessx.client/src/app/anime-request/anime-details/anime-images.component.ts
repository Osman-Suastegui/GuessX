import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Anime, AnimeImage, TitleData } from '../anime.model';
import { JikanService } from '../jikan.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeneralService } from '../../utils/general.service';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-images',
  templateUrl: './anime-images.component.html',
  styleUrl: './anime-images.component.css'
})
export class AnimeImagesComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AnimeImagesComponent>);
  readonly data = inject<Anime | TitleData>(MAT_DIALOG_DATA);

  imagesUrls: { imageUrl: string }[] = [];
  highlightedImage: AnimeImage | null = null;

  titlesForm: FormGroup = new FormGroup({});
  genresControl = new FormControl<string[]>([]);
  titleControl = new FormControl('');
  selectedImagesControl = new FormControl<AnimeImage[]>([]);

  selectedImage: { imageUrl: string } | null = null;
  defaultGenres: string[] = [];

  isSaved = false;

  constructor(
    private _jikanService: JikanService,
    private _animeService: AnimeService,
    private fb: FormBuilder,
    private _generalService: GeneralService
  ) {}

  ngOnInit(): void {
    console.log('Datos recibidos en el diálogo:', this.data);

    // Detectar si es TitleData (guardado) o Anime (nuevo)
    this.isSaved = !('mal_id' in this.data);

    if (this.isSaved) {
      const saved = this.data as TitleData;
      this.imagesUrls = saved.titleImages || [];
      this.selectedImage = this.imagesUrls.length > 0 ? this.imagesUrls[0] : null;

      this.titleControl.setValue(saved.titleName);
      this.defaultGenres = saved.genres;
      this.genresControl.setValue(saved.genres);

      const titlesControls = saved.titleAnswers.map(title =>
        this.fb.group({ title: [title] })
      );
      this.titlesForm.setControl('titlesArray', this.fb.array(titlesControls));
    } else {
      const anime = this.data as Anime;
      this.titleControl.setValue(anime.title);

      this.defaultGenres = anime.genres.map(g => g.name);
      this.genresControl.setValue(this.defaultGenres);

      this.setTitles(anime);
      this.getImages(anime.mal_id);
    }
  }

  setTitles(anime: Anime) {
    const uniqueTitles = new Set<string>();

    for (const t of anime.titles) {
      if (t.title) uniqueTitles.add(t.title);
    }

    const titlesControls = Array.from(uniqueTitles).map(title =>
      this.fb.group({ title: [title] })
    );

    const formArray = this.fb.array(titlesControls);
    this.titlesForm.setControl('titlesArray', formArray);
  }

  get titlesArray() {
    return this.titlesForm.get('titlesArray') as FormArray;
  }

  selectAndPreview(image: { imageUrl: string }) {
    this.selectedImage = image;
    this.toggleSelection(image);
  }

  getImages(mal_id: number) {
    this._jikanService.getAnimePictures(mal_id).subscribe({
      next: (response: any) => {
        this.imagesUrls = response;
        this.selectedImage = this.imagesUrls.length > 0 ? this.imagesUrls[0] : null;
      },
      error: (error) => {
        console.error('Error fetching anime images:', error);
        this.dialogRef.close([]);
      }
    });
  }

  toggleSelection(image: AnimeImage): void {
    const selectedImages = this.selectedImagesControl.value ?? [];
    const index = selectedImages.findIndex((img: AnimeImage) => img.imageUrl === image.imageUrl);
    if (index > -1) {
      selectedImages.splice(index, 1);
    } else {
      selectedImages.push(image);
    }
    this.selectedImagesControl.setValue([...selectedImages]);
  }

  isSelected(image: AnimeImage): boolean {
    const selectedImages = this.selectedImagesControl.value ?? [];
    return selectedImages.some((img: AnimeImage) => img.imageUrl === image.imageUrl);
  }

  getSelectedImagesCount(): number {
    return this.selectedImagesControl.value?.length ?? 0;
  }

  save(): void {
    const selectedImages = this.selectedImagesControl.value ?? [];
    const answers = this.titlesArray.value;
    const title = this.titleControl.value;
    const genres = this.genresControl.value;

    const addObject: TitleData = {
      titleName: title || '',
      category: 'anime',
      genres: genres || [],
      titleImages: [...selectedImages],
      titleAnswers: answers.map((answer: any) => answer.title),
    };

    this._animeService.registerAnimeRequest(addObject).subscribe({
      next: (response) => {
        this._generalService.showMessage('Anime request registered successfully!', 'success');
        this.dialogRef.close(response);
      },
      error: (error) => {
        this._generalService.showMessage('Error registering anime request: ' + error.message, 'error');
        this.dialogRef.close([]);
      }
    });
  }

  selectAll(): void {
    const allSelected = this.selectedImagesControl.value?.length === this.imagesUrls.length;
    if (allSelected) {
      this.selectedImagesControl.setValue([]);
    } else {
      const allImages: AnimeImage[] = this.imagesUrls.map(image => ({
        imageUrl: image.imageUrl,
        selected: true,
        imageType: 'anime',
      }));
      this.selectedImagesControl.setValue(allImages);
    }
  }

  addTitleInput() {
    this.titlesArray.push(this.fb.group({ title: [''] }));
  }

  removeTitleInput(index: number) {
    this.titlesArray.removeAt(index);
  }
}
