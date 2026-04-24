import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home-page-multi-games/home-page-multi-games.routes').then((m) => m.homePageMultiGamesRoutes),
  }

];
