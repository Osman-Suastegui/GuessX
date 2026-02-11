import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { GeneralService } from '../../utils/general.service';
import { RoomState } from '../room.model';
import { GameSignalRService } from './../../services/game-signal-r.service';
@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css',
})
export class GameRoomComponent implements OnInit, OnDestroy {
  public animeInformation: any = {
    name: 'Demon Slayer',
    src: '../../../assets/demon_slayer.webp',
    answers: ['Demon Slayer', 'Kimetsu no Yaiba'],
  };

  public roomId: string = '';
  public roomState: RoomState | null = null;

  constructor(
    public gameSignalRService: GameSignalRService,
    public generalService: GeneralService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.setListeners();
    this.initializeRoom();
  }

  private async initializeRoom() {
    // sacar el id de la ruta
    this.roomId = window.location.pathname.split('/').pop() || '';
    let playerName: string = this.storageService.getPlayerName() || '';

    // if we dont have a play name, we open a prompt to ask for it, and save it in local storage
    if (!playerName) {
      playerName = prompt('Please enter your name:') || 'Anonymous';
      this.storageService.setPlayerName(playerName);
    }

    try {
      if (!this.gameSignalRService.isHubConnected()) {
        console.log('Hub not connected, starting connection...');
        await this.gameSignalRService.startConnection('http://localhost:5290/gameHub');
      }

      this.gameSignalRService.joinRoom(this.roomId, playerName);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  }

  private setListeners() {
    this.gameSignalRService.roomState$.subscribe((roomState: RoomState | null) => {
      if (!roomState) {
        return;
      }

      this.roomState = roomState;
      console.log('Room state updated:', roomState);

      const currentImg = roomState.images[roomState.currentImageIndex];

      this.animeInformation = {
        name: currentImg.titleName,
        src: currentImg.titleImages[0].imageUrl,
        answers: currentImg.titleAnswers,
      };
    });
  }

  copyRoomLink(): void {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink).then(
      () => this.generalService.showMessage('Room link copied to clipboard!', 'snackbar-success'),
      () => this.generalService.showMessage('Failed to copy the room link.', 'snackbar-error'),
    );
  }

  ngOnDestroy(): void {
    this.gameSignalRService.roomState$.unsubscribe();
  }
}
