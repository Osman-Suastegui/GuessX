import { Routes } from '@angular/router';
import { GameRoomComponent } from './game-room/game-room.component';
import { HomePageComponent } from '../home-page/home-page.component';

export const gameRoomRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: GameRoomComponent
  },
  {
    path: 'home',
    component: HomePageComponent
  }
];
