import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface LeagueNavigationItem {
  readonly label: string;
  readonly path: string;
  readonly description: string;
}

const LEAGUE_NAVIGATION_ITEMS: readonly LeagueNavigationItem[] = [
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
  selector: 'app-league-of-legends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './league-of-legends-page.component.html',
  styleUrl: './league-of-legends-page.component.css'
})
export class LeagueOfLegendsPageComponent {
  public readonly navigationItems: readonly LeagueNavigationItem[] = LEAGUE_NAVIGATION_ITEMS;

}
