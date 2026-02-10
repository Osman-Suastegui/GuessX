import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AnimeImagesComponent } from './anime-details/anime-images.component';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { animeRequestRoutes } from './anime-request.routes';

@NgModule({
  declarations: [AnimeListComponent, AnimeImagesComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule.forChild(animeRequestRoutes)],
})
export class AnimeRequestModule {}
