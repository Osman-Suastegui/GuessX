import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { animeRequestRoutes } from './anime-request.routes';



@NgModule({
  declarations: [
    AnimeListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(animeRequestRoutes)
  ]
})
export class AnimeRequestModule { }
