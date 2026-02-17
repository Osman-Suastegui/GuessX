import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameSignalRService } from '../services/game-signal-r.service';
import { StorageService } from '../services/storage.service';
import { RoomIdDialogComponent } from './room-id-dialog/room-id-dialog.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  playerName: string = '';
  isLoading: boolean = false;
  currentStep: number = 0;
  steps: number[] = [0, 1, 2, 3];
  roomId: string = '';

  instructionSteps = [
    {
      number: 1,
      title: 'Draw the Character',
      description: "You'll receive an anime character image clues. Type the name as clearly as possible so others can guess what it is!",
    },
    {
      number: 2,
      title: "Guess Others' Drawings",
      description: 'Look at types from other players and try to guess which anime character from image is.',
    },
    {
      number: 3,
      title: 'Score Points',
      description: 'Earn points for correct guesses and when others guess your animes correctly!',
    },
    {
      number: 4,
      title: 'Have Fun!',
      description: "Enjoy the hilarious results and compete with friends to see who's the ultimate anime expert!",
    },
  ];

  private carouselInterval: any;
  // gridRows and gridCols determine how many fragments the image will be divided into. For example, if gridRows=5 and gridCols=3,
  // the image will be divided into 15 fragments (5 rows x 3 columns).
  // Each hint will reveal one of these fragments
  private gridRows = 5;
  private gridCols = 3;

  constructor(
    private router: Router,
    private gameSignalRService: GameSignalRService,
    private dialog: MatDialog,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    // Auto-advance carousel every 4 seconds
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextStep();
    }, 4000);
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  async createGame() {
    const playerName = this.playerName.trim();
    if (!playerName || playerName.length < 2) {
      return;
    }

    // Open dialog to get room ID
    // const dialogRef = this.dialog.open(RoomIdDialogComponent, {
    //   width: '450px',
    //   disableClose: false,
    //   data: null,
    // });
    const numberOfPictures = '5';
    // let numberOfPictures = await firstValueFrom(dialogRef.afterClosed());
    // if (numberOfPictures && numberOfPictures.trim().length > 0) {
    //   numberOfPictures = numberOfPictures.trim();
    // }
    // if (isNaN(numberOfPictures)) {
    //   return;
    // }

    this.isLoading = true;
    this.stopCarousel();

    try {
      // Store player name in localStorage for game use
      this.storageService.setPlayerName(playerName);

      // Start SignalR connection
      await this.gameSignalRService.startConnection('http://localhost:5290/gameHub');

      // Create room and navigate to game room
      this.roomId = await this.gameSignalRService.createRoom(playerName, parseInt(numberOfPictures), this.gridRows, this.gridCols);
      this.router.navigate(['/game-room/', this.roomId]);
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async requestJoiningCode() {
    // Validate player name first
    const playerName = this.playerName.trim();
    if (!playerName || playerName.length < 2) {
      return;
    }

    // Open dialog to get room ID
    const dialogRef = this.dialog.open(RoomIdDialogComponent, {
      width: '450px',
      disableClose: false,
      data: null,
    });

    dialogRef.afterClosed().subscribe(async (roomId: string | undefined) => {
      if (roomId && roomId.trim().length > 0) {
        // Store player name in localStorage
        this.storageService.setPlayerName(playerName);

        // Start SignalR connection if not already started
        try {
          await this.gameSignalRService.startConnection('http://localhost:5290/gameHub');

          // Navigate to game room with the entered roomId
          this.router.navigate(['/game-room/', roomId.trim()]);
        } catch (error) {
          console.error('Error connecting to SignalR:', error);
        }
      }
    });
  }

  onNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.playerName = target.value;
  }

  // Carousel methods
  nextStep() {
    this.currentStep = (this.currentStep + 1) % this.steps.length;
  }

  previousStep() {
    this.currentStep = this.currentStep === 0 ? this.steps.length - 1 : this.currentStep - 1;
  }

  setCurrentStep(step: number) {
    this.currentStep = step;
    // Restart carousel timer when user manually changes step
    this.stopCarousel();
    this.startCarousel();
  }

  // Validate player name in real-time
  isNameValid(): boolean {
    return this.playerName.trim().length >= 2;
  }
}
