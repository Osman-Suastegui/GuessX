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
  constructor(public gameSignalRService: GameSignalRService) {
  }

  async ngAfterViewInit() {
    await this.gameSignalRService.startConnection("https://localhost:7230/gameHub");

    this.roomId = "";
    try {
      this.roomId = await this.gameSignalRService.createRoom();
      console.log("Room created with ID:", this.roomId);
    } catch (error) {
      console.error("Error creating room:", error);
    }

    try {
      await this.gameSignalRService.joinRoom(this.roomId, "TestUser");
    } catch (error) {
      console.error("Error joining room:", error);
    }

  }
}
