import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '',
    loadChildren: () => import('./game-room/game-room.module').then(m => m.GameRoomModule) },

];
