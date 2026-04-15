import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home-page-multi-games/home-page-multi-games.routes').then((m) => m.homePageMultiGamesRoutes),
  },
  {
    path: 'game-room',
    loadChildren: () => import('./game-room/game-room.module').then((m) => m.GameRoomModule),
  },
  {
    path: 'anime-request',
    loadChildren: () => import('./anime-request/anime-request.module').then((m) => m.AnimeRequestModule),
  },
];
