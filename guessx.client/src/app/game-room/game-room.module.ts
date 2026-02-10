import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ActivePlayersComponent } from './active-players/active-players.component';
import { ChatComponent } from './chat/chat.component';
import { gameRoomRoutes } from './game-room.routes';
import { GameRoomComponent } from './game-room/game-room.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TimeBarComponent } from './time-bar/time-bar.component';

@NgModule({
  declarations: [GameRoomComponent, LeaderboardComponent, ActivePlayersComponent, ChatComponent, ImageViewerComponent, TimeBarComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule.forChild(gameRoomRoutes)],
})
export class GameRoomModule {}
