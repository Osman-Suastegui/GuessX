import { GeneralService } from '../../utils/general.service';
import { GameSignalRService } from './../../services/game-signal-r.service';
import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { RoomState } from '../room.model';
@Component({
  selector: "app-game-room",
  templateUrl: "./game-room.component.html",
  styleUrl: "./game-room.component.css",
})
export class GameRoomComponent implements AfterViewInit,OnDestroy {
  animeInformation: any = {
    name: "Demon Slayer",
    src: "../../../assets/demon_slayer.webp",
    answers: ["Demon Slayer", "Kimetsu no Yaiba"],
  };
  roomId: string = "";
  roomState: RoomState | null = null;
  // GameSignalRService
  constructor(
    public gameSignalRService: GameSignalRService,
    public generalService: GeneralService
  ) {
  }

  ngAfterViewInit() {
    this.setListeners();
    this.initializeRoom();
  }

  private async initializeRoom() {
    console.log("Initializing room...");
    // sacar el id de la ruta
    this.roomId = window.location.pathname.split("/").pop() || "";
    let playerName: string = localStorage.getItem("playerName") || "";

    // if we dont have a play name, we open a prompt to ask for it, and save it in local storage
    if (!playerName) {
      playerName = prompt("Please enter your name:") || "Anonymous";
      localStorage.setItem("playerName", playerName);
    }
    
    try {
      if(!this.gameSignalRService.isHubConnected()) {
        console.log("Hub not connected, starting connection...");
        await this.gameSignalRService.startConnection("http://localhost:5290/gameHub");
      }

      this.gameSignalRService.joinRoom(this.roomId, playerName);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  private setListeners() {
    this.gameSignalRService.roomState$.subscribe((roomState: RoomState | null) => {
      this.roomState = roomState;
      if (roomState) {
        console.log("Room state updated:", roomState);
        let src = roomState.images[roomState.currentImageIndex].titleImages[0].imageUrl;
        let answers = roomState.images[roomState.currentImageIndex].titleAnswers;
        let name = roomState.images[roomState.currentImageIndex].titleName;
        this.animeInformation = {
          name: name,
          src: src,
          answers: answers
        };
      }
    });
  }

  copyRoomLink(): void {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink).then(
      () => {
        this.generalService.showMessage('Room link copied to clipboard!', 'snackbar-success');
      },
      (err) => {
        this.generalService.showMessage('Failed to copy the room link.', 'snackbar-error');
      }
    );
  }
  ngOnDestroy(): void {
    this.gameSignalRService.roomState$.unsubscribe();
  }
}
