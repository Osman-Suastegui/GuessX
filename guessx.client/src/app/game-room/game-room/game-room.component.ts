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

  async ngAfterViewInit() {
    //sacar el id de la ruta
    this.roomId = window.location.pathname.split("/").pop() || "";

    try {
      await this.gameSignalRService.joinRoom(this.roomId, "TestUser");
    } catch (error) {
      console.error("Error joining room:", error);
    }

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
