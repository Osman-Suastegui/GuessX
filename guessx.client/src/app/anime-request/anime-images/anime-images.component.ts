import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { Anime } from '../anime.model';
import { AnimeServiceService } from '../anime-service.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-anime-images',
  templateUrl: './anime-images.component.html',
  styleUrl: './anime-images.component.css'
})
export class AnimeImagesComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AnimeImagesComponent>);
  readonly data = inject<Anime>(MAT_DIALOG_DATA);
  imagesUrls: { url: string }[] = [];
  selectedUrls: Set<string> = new Set();
  titlesForm: FormGroup = new FormGroup({});


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
      this.fb.group({ title: [title] })  // cada control es un FormGroup con una propiedad 'title'
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
      console.log('Anime images fetched:', this.imagesUrls);
    }, error => {
      console.error('Error fetching anime images:', error);
      this.dialogRef.close([]);
    });
  }

  toggleSelection(url: string): void {
    if (this.selectedUrls.has(url)) {
      this.selectedUrls.delete(url);
    } else {
      this.selectedUrls.add(url);
    }
  }

  isSelected(url: string): boolean {
    return this.selectedUrls.has(url);
  }

  logSelectedUrls(): void {
    const selected = Array.from(this.selectedUrls);
    console.log('URLs seleccionadas:', selected);
  }

  selectAll(): void {
    if (this.selectedUrls.size === this.imagesUrls.length) {
      // Si ya están todas seleccionadas, limpiar la selección
      this.selectedUrls.clear();
    } else {
      // Si no están todas seleccionadas, seleccionar todas
      this.selectedUrls = new Set(this.imagesUrls.map(image => image.url));
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

  saveTitles() {
    const updatedTitles = this.titlesArray.value;
    console.log('Títulos guardados:', updatedTitles);
    // Aquí haces lo que necesites con el arreglo actualizado
    // Ejemplo: actualizar this.data.titles, emitir evento, etc.
  }

}
