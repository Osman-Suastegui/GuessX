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
  // GameSignalRService
  constructor(public gameSignalRService: GameSignalRService) {
  }
  async ngAfterViewInit() {
    await this.gameSignalRService.startConnection("https://localhost:7230/gameHub");
    this.gameSignalRService.invoke("CreateRoom");
  }
}
