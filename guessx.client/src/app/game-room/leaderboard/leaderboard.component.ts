import { Component } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {

  leaderboard = [
    { id: 1, name: 'Player One', score: 1500, correct: 12, avatar: 'P1' },
    { id: 2, name: 'Player Two', score: 1400, correct: 11, avatar: 'P2' },
    { id: 3, name: 'Player Three', score: 0, correct: 10, avatar: 'P3' },

    // ...otros jugadores
  ];

}
