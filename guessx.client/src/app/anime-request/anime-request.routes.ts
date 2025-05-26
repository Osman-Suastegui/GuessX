import { Routes } from "@angular/router";
import { AnimeListComponent } from "./anime-list/anime-list.component";

export const animeRequestRoutes: Routes = [
  {
    path: '',
    component: AnimeListComponent
  }
];
