import { Routes } from '@angular/router';
import { AnimePageComponent } from './anime-page/anime-page.component';
import { HomePageMultiGamesComponent } from './home-page-multi-games.component';
import { LeagueOfLegendsPageComponent } from './league-of-legends-page/league-of-legends-page.component';

export const homePageMultiGamesRoutes: Routes = [
  {
    path: '',
    component: HomePageMultiGamesComponent,
    children: [
      {
        path: '',
        redirectTo: 'league-of-legends',
        pathMatch: 'full',
      },
      {
        path: 'league-of-legends',
        component: LeagueOfLegendsPageComponent,
        children: [
          {
            path: '',
            redirectTo: 'splash',
            pathMatch: 'full',
          },
          {
            path: 'splash',
            loadComponent: () =>
              import('./league-of-legends-splash/league-of-legends-splash.component').then((m) => m.LeagueOfLegendsSplashComponent),
          },
          {
            path: 'play',
            loadComponent: () => import('./league-of-legends/league-of-legends.component').then((m) => m.LeagueOfLegendsComponent),
          },
        ],
      },
      {
        path: 'anime',
        component: AnimePageComponent,
        children: [
          {
            path: '',
            redirectTo: 'splash',
            pathMatch: 'full',
          },
          {
            path: 'splash',
            loadComponent: () => import('./anime-splash/anime-splash.component').then((m) => m.AnimeSplashComponent),
          },
        ],
      },
      {
        path: 'valorant',
        loadComponent: () => import('./valorant/valorant.component').then((m) => m.ValorantComponent),
      },
      {
        path: 'minecraft',
        loadComponent: () => import('./minecraft/minecraft.component').then((m) => m.MinecraftComponent),
      },
    ],
  },
];
