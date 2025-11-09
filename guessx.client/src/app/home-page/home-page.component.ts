import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { GameSignalRService } from "../services/game-signal-r.service";
import { MatDialog } from "@angular/material/dialog";
import { RoomIdDialogComponent } from "./room-id-dialog/room-id-dialog.component";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
})
export class HomePageComponent implements OnInit, OnDestroy {
  playerName: string = "";
  isLoading: boolean = false;
  currentStep: number = 0;
  steps: number[] = [0, 1, 2, 3];
  roomId: string = "";
  private carouselInterval: any;

  instructionSteps = [
    {
      number: 1,
      title: "Draw the Character",
      description:
        "You'll receive an anime character image clues. Type the name as clearly as possible so others can guess what it is!",
      bgColor: "bg-cyan-500",
    },
    {
      number: 2,
      title: "Guess Others' Drawings",
      description:
        "Look at types from other players and try to guess which anime character from image is.",
      bgColor: "bg-green-500",
    },
    {
      number: 3,
      title: "Score Points",
      description:
        "Earn points for correct guesses and when others guess your animes correctly!",
      bgColor: "bg-purple-500",
    },
    {
      number: 4,
      title: "Have Fun!",
      description:
        "Enjoy the hilarious results and compete with friends to see who's the ultimate anime expert!",
      bgColor: "bg-pink-500",
    },
  ];

  constructor(
    private router: Router,
    private gameSignalRService: GameSignalRService,
    private dialog: MatDialog
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

  async onStartGame() {
    let playerName = this.playerName.trim();
    if (!playerName || playerName.length < 2) {
      return;
    }

    this.isLoading = true;
    this.stopCarousel();

    try {
      // Store player name in localStorage for game use
      localStorage.setItem("playerName", playerName);

      // Start SignalR connection
      await this.gameSignalRService.startConnection("https://localhost:7230/gameHub");

      // Create room and navigate to game room
      this.roomId = await this.gameSignalRService.createRoom(playerName);
      this.router.navigate(["/game-room/", this.roomId]);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async requestJoiningCode() {
    // Validate player name first
    let playerName = this.playerName.trim();
    if (!playerName || playerName.length < 2) {
      return;
    }

    // Open dialog to get room ID
    const dialogRef = this.dialog.open(RoomIdDialogComponent, {
      width: '450px',
      disableClose: false,
      data: null
    });

    dialogRef.afterClosed().subscribe(async (roomId: string | undefined) => {
      if (roomId && roomId.trim().length > 0) {
        // Store player name in localStorage
        localStorage.setItem("playerName", playerName);

        // Start SignalR connection if not already started
        try {
          await this.gameSignalRService.startConnection("https://localhost:7230/gameHub");

          // Navigate to game room with the entered roomId
          this.router.navigate(["/game-room/", roomId.trim()]);
        } catch (error) {
          console.error("Error connecting to SignalR:", error);
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
    this.currentStep =
      this.currentStep === 0 ? this.steps.length - 1 : this.currentStep - 1;
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

  // Get button state classes
  getButtonClasses(): string {
    if (this.isLoading) {
      return "bg-gray-600 text-gray-300 cursor-not-allowed border border-gray-500";
    }

    if (!this.isNameValid()) {
      return "bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500";
    }

    return "bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-400 hover:border-cyan-300 transform hover:scale-105";
  }


}
