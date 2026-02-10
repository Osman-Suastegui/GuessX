import { Component, Input } from '@angular/core';
import { UserRoom } from '../room.model';

@Component({
  selector: 'app-active-players',
  templateUrl: './active-players.component.html',
  styleUrl: './active-players.component.css',
})
export class ActivePlayersComponent {
  @Input() users: UserRoom[] = [];
}
