import { map } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { Anime } from '../anime.model';
import { AnimeServiceService } from '../anime-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface AnimeImage {
  url: string;
  selected?: boolean;
  imageType?: string; // 'jpg' or 'webp'
  id?: number; // optional, if needed for identification
}
@Component({
  selector: 'app-anime-images',
  templateUrl: './anime-images.component.html',
  styleUrl: './anime-images.component.css'
})
export class AnimeImagesComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AnimeImagesComponent>);
  readonly data = inject<Anime>(MAT_DIALOG_DATA);

  imagesUrls: { url: string }[] = [];
  selectedImages: Set<AnimeImage> = new Set();

  titlesForm: FormGroup = new FormGroup({});
  genresControl = new FormControl("");

  titleControl = new FormControl(this.data.title);

  defaultGenres: string[] = [...this.data.genres.map(g => g.name)];


  constructor( private animeService: AnimeServiceService,private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('Datos recibidos en el diálogo:', this.data);

    this.setTitles();
    this.getImages();
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

  getImages() {
    this.animeService.getAnimePictures(this.data.mal_id).subscribe((response: any) => {
      this.imagesUrls = response;
    }, error => {
      console.error('Error fetching anime images:', error);
      this.dialogRef.close([]);
    });
  }

  toggleSelection(image: AnimeImage): void {
    if (this.selectedImages.has(image)) {
      this.selectedImages.delete(image);
    } else {
      this.selectedImages.add(image);
    }
  }

  isSelected(image: AnimeImage): boolean {
    return this.selectedImages.has(image);
  }

  save(): void {
    const selectedImages = Array.from(this.selectedImages);
    const answers = this.titlesArray.value;
    const title = this.titleControl.value;
    const genres = this.genresControl.value;

    const addObject = {
      titleName: title,
      category: 'anime',
      genres: genres,
      titleImages: [...selectedImages],
      titleAnswers: [...answers.map((answer: any) => answer.title)]
    };

    console.log('Datos a enviar:', addObject);
  }

  selectAll(): void {
    if (this.selectedImages.size === this.imagesUrls.length) {
      // Si ya están todas seleccionadas, limpiar la selección
      this.selectedImages.clear();
    } else {
      // Si no están todas seleccionadas, seleccionar todas
      this.imagesUrls.forEach((image: AnimeImage) =>
        this.selectedImages.add({
          url: image.url,
          selected: true,
          imageType: 'webp', // o 'jpg' según sea necesario
          id: this.data.mal_id // o cualquier otro identificador relevante
        })
      );
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
