import { map } from 'rxjs';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { Anime, AnimeImage, TitleData } from '../anime.model';
import { AnimeServiceService } from '../anime-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeneralService } from '../../utils/general.service';


@Component({
  selector: 'app-anime-images',
  templateUrl: './anime-images.component.html',
  styleUrl: './anime-images.component.css'
})
export class AnimeImagesComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AnimeImagesComponent>);
  readonly data = inject<Anime>(MAT_DIALOG_DATA);

  imagesUrls: { imageUrl: string }[] = [];
  highlightedImage: AnimeImage | null = null;

  titlesForm: FormGroup = new FormGroup({});
  genresControl = new FormControl<string[]>([]);
  titleControl = new FormControl(this.data.title);
  selectedImagesControl = new FormControl<AnimeImage[]>([]);

  selectedImage: { imageUrl: string } | null = null;
  defaultGenres: string[] = [];


  constructor( 
    private _animeService: AnimeServiceService,
    private fb: FormBuilder,
    private _generalService: GeneralService
  ) {}

  ngOnInit(): void {
    console.log('Datos recibidos en el diálogo:', this.data);

    this.setTitles();
    this.getImages();
    //Set Genres
    this.defaultGenres = this.data.genres.map(g => g.name);
    this.genresControl.setValue([...this.data.genres.map(g => g.name)]);
  }


  setTitles() {
    const uniqueTitles = new Set<string>();

    for (const t of this.data.titles) {
      if (t.title) uniqueTitles.add(t.title);
    }

    const titlesControls = Array.from(uniqueTitles).map(title =>
      this.fb.group({
        title: [title]
      })  // cada control es un FormGroup con una propiedad 'title'
    );

    const formArray = this.fb.array(titlesControls);
    this.titlesForm.setControl('titlesArray', formArray);
  }


  // getter para simplificar acceso en el template
  get titlesArray() {
    return this.titlesForm.get('titlesArray') as FormArray;
  }


  selectAndPreview(image: { imageUrl: string }) {
    this.selectedImage = image;
    this.toggleSelection(image);
  }


  getImages() {
    this._animeService.getAnimePictures(this.data.mal_id).subscribe((response: any) => {
      this.imagesUrls = response;
      this.selectedImage = this.imagesUrls.length > 0 ? this.imagesUrls[0] : null;
    }, error => {
      console.error('Error fetching anime images:', error);
      this.dialogRef.close([]);
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
      titleName: title || '' ,
      category: 'anime',
      genres: genres || [],
      titleImages: [...selectedImages] ,
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
      const allImages: AnimeImage[] = this.imagesUrls.map((image, idx) => ({
        imageUrl: image.imageUrl,
        selected: true,
        imageType: 'anime',
      }));
      this.selectedImagesControl.setValue(allImages);
    }
  }

  addTitle() {
    this.titlesArray.push(this.fb.group({ title: [''] }));
  }


  addTitleInput() {
    this.titlesArray.push(this.fb.group({ title: [''] }));
  }


  removeTitleInput(index: number) {
    this.titlesArray.removeAt(index);
  }


}
