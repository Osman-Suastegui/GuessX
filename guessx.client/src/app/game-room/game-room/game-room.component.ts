import { Component, ViewChild } from '@angular/core';
import { TimeBarComponent } from '../time-bar/time-bar.component';
@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})
export class GameRoomComponent {
  @ViewChild(TimeBarComponent) timerBar!: TimeBarComponent;

  reiniciarTemporizador(): void {
    this.timerBar.resetTimer();
  }

  handleSkip(): void {
    console.log('Usuario presionó skip');
    this.timerBar.resetTimer();
  }

  handleTimeEnd(): void {
    console.log('Tiempo finalizó');
    this.timerBar.resetTimer();
  }

}
