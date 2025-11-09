import { Component, Input } from '@angular/core';
import { UserRoom } from '../room.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {

  @Input() users: UserRoom[] = [];
}
