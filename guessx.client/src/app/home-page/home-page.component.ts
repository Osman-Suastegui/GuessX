import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {}

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

  onStartGame() {
    if (!this.playerName.trim()) {
      return;
    }

    if (this.playerName.trim().length < 2) {
      return;
    }

    this.isLoading = true;
    this.stopCarousel();

    // Simulate loading time
    setTimeout(() => {
      // Store player name in localStorage for game use
      localStorage.setItem("playerName", this.playerName.trim());

      // Navigate to game room or create room
      this.router.navigate(["/game-room"]);
    }, 1000);
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

  // Get button text
  getButtonText(): string {
    if (this.isLoading) {
      return "Starting...";
    }

    if (!this.isNameValid()) {
      return "Enter Name";
    }

    return "Start Game";
  }
}
