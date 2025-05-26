import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '',
    loadChildren: () => import('./game-room/game-room.module').then(m => m.GameRoomModule)
  },
  {
    path: 'anime-request',
    loadChildren: () => import('./anime-request/anime-request.module').then(m => m.AnimeRequestModule)
  }

];
