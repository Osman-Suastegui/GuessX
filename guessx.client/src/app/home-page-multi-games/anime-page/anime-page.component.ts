import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeagueNavigationItem } from '../league-of-legends-page/league-of-legends-page.component';

const ANIME_NAVIGATION_ITEMS: readonly LeagueNavigationItem[] = [
  {
    label: 'Splash',
    path: 'splash',
    description: 'Overview and mode intro',
  },
  {
    label: 'Play',
    path: 'play',
    description: 'Open the champion guessing game',
  },
];

@Component({
  selector: 'app-anime-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './anime-page.component.html',
  styleUrl: './anime-page.component.css',
})
export class AnimePageComponent {
  navigationItems = ANIME_NAVIGATION_ITEMS;
}
