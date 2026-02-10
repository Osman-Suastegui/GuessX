import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { GameRoomComponent } from './game-room/game-room.component';

export const gameRoomRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: ':id',
    component: GameRoomComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
];
