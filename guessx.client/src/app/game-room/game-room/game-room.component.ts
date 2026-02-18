import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SIGNAL_CONST } from '../../const/signal.const';
import { StorageService } from '../../services/storage.service';
import { GeneralService } from '../../utils/general.service';
import { RoomState } from '../room.model';
import { TimeBarComponent } from '../time-bar/time-bar.component';
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
  public showSquareAt: { row: number; col: number } | null = null;
  public roundDuration: number = 3; // duration of each round in seconds
  public maxHints: number = 3;
  public currentHint: number = 1;

  @ViewChild(TimeBarComponent, { static: true }) timerBar!: TimeBarComponent;
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

      // if we join we want to show the current image;
      if (roomState.currentEndPoint === 'ShowNextPicture' || roomState.currentEndPoint === 'JoinRoom') {
        this.animeInformation = {
          name: currentImg.titleName,
          src: currentImg.titleImages[0].imageUrl,
          answers: currentImg.titleAnswers,
        };
        this.timerBar.resetTimer();
        this.currentHint = 1;
      }

      if (roomState.currentEndPoint === 'RevealNextHint') {
        this.showSquareAt = roomState.availableSquares[roomState.currentSquareToShowIndex || 0] || null;
        this.currentHint++;
        this.timerBar.resetTimer();
      }
    });
  }

  copyRoomLink(): void {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink).then(
      () => this.generalService.showMessage('Room link copied to clipboard!', 'snackbar-success'),
      () => this.generalService.showMessage('Failed to copy the room link.', 'snackbar-error'),
    );
  }

  handleSkip(): void {
    console.log('Usuario presionó skip');
  }

  handleTimeEnd(): void {
    // Maximum hints reached, reveal the whole image
    if (this.isMaximunHintsReached()) {
      console.log('Maximum hints reached. Revealing the whole anime...');
      // after we reveal the whole anime we should show the next one after a few seconds, for example 5 seconds
      setTimeout(() => {
        // we send a signal to the server to show the next anime
        // only the owner of the room should send this signal,
        // because if we send it from multiple clients,
        // it could cause showing the next picture multiple times
        if (this.roomState?.owner === this.storageService.getPlayerName()) {
          // SHOW NEXT PICTURE
          this.gameSignalRService.invoke(SIGNAL_CONST.SHOW_NEXT_PICTURE, this.roomState?.roomId);
        }
      }, 2000);
      return;
    }
    // Reveal a hint
    this.revealHint();
  }

  revealHint() {
    // RELEAL NEXT HINT
    if (this.roomState?.owner === this.storageService.getPlayerName()) {
      this.gameSignalRService.invoke(SIGNAL_CONST.REVEAL_NEXT_HINT, this.roomState?.roomId);
    }
  }

  isMaximunHintsReached(): boolean {
    return this.currentHint >= this.maxHints;
  }

  ngOnDestroy(): void {
    this.gameSignalRService.roomState$.unsubscribe();
  }
}
