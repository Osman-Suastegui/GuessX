import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameRoomModule } from './game-room/game-room.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameRoomModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mi-proyecto-angular18';
}
