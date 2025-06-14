import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { animeRequestRoutes } from './anime-request.routes';
import { AnimeImagesComponent } from './anime-details/anime-images.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    AnimeListComponent,
    AnimeImagesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(animeRequestRoutes)
  ]
})
export class AnimeRequestModule { }
