import { GeneralService } from '../../utils/general.service';
import { GameSignalRService } from './../../services/game-signal-r.service';
import { AfterViewInit, Component } from "@angular/core";
@Component({
  selector: "app-game-room",
  templateUrl: "./game-room.component.html",
  styleUrl: "./game-room.component.css",
})
export class GameRoomComponent implements AfterViewInit {
  animeInformation: any = {
    name: "Demon Slayer",
    src: "../../../assets/demon_slayer.webp",
    answers: ["Demon Slayer", "Kimetsu no Yaiba"],
  };
  roomId: string = "";
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
    // sacar el id de la ruta
    this.roomId = window.location.pathname.split("/").pop() || "";
    let playerName: string = localStorage.getItem("playerName") || "";

    try {
      this.gameSignalRService.joinRoom(this.roomId, playerName);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  private setListeners() {
    this.gameSignalRService.roomState$.subscribe((roomState) => {
      console.log("Room state updated:", roomState);
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
}
