import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavigationItem {
  readonly icon: string;
  readonly label: string;
  readonly path: string;
}

interface NavigationSection {
  readonly title: string;
  readonly items: readonly NavigationItem[];
}

const NAVIGATION_SECTIONS: readonly NavigationSection[] = [
  {
    title: 'Gaming',
    items: [
      { icon: 'swords', label: 'League of Legends', path: 'league-of-legends' },
      { icon: 'target', label: 'Valorant', path: 'valorant' },
      { icon: 'deployed_code', label: 'Minecraft', path: 'minecraft' },
    ],
  },
  {
    title: 'Anime',
    items: [
      { icon: 'auto_awesome', label: 'Naruto', path: '/anime-request' },
      { icon: 'sailing', label: 'One Piece', path: '/anime-request' },
    ],
  },
  {
    title: 'Movies & TV',
    items: [
      { icon: 'movie', label: 'Star Wars', path: '/anime-request' },
      { icon: 'shield', label: 'Marvel MCU', path: '/anime-request' },
    ],
  },
];

@Component({
  selector: 'app-home-page-multi-games',
  templateUrl: './home-page-multi-games.component.html',
  styleUrl: './home-page-multi-games.component.css',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class HomePageMultiGamesComponent {
  public searchTerm: string = '';

  public readonly navigationSections: readonly NavigationSection[] = NAVIGATION_SECTIONS;

  // ngOnInit(): void {
  //   // this.charactersService.getCharacter('a').subscribe((characters: any) => {
  //   //   console.log(JSON.parse(characters));
  //   // });
  // }

  public onSearch(term: string): void {
    this.searchTerm = term;
  }
}
