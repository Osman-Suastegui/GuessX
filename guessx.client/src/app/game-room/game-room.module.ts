import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomComponent } from './game-room/game-room.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ActivePlayersComponent } from './active-players/active-players.component';
import { ChatComponent } from './chat/chat.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { RouterModule } from '@angular/router';
import { gameRoomRoutes } from './game-room.routes';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GameRoomComponent,
    LeaderboardComponent,
    ActivePlayersComponent,
    ChatComponent,
    ImageViewerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(gameRoomRoutes)
  ]
})
export class GameRoomModule { }
