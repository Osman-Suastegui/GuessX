import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { RoomState, ChatMessage } from '../game-room/room.model';

@Injectable({
  providedIn: 'root'
})
export class GameSignalRService {
  private hubConnection!: signalR.HubConnection;
  public roomState$ = new BehaviorSubject<RoomState | null>(null);

  public messages$ = new Subject<ChatMessage>()

  constructor() { }

  async startConnection(hubUrl: string) {
    console.log("Starting SignalR connection to:", hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
    try {
      await this.hubConnection.start();
      // this.hubConnection.on('UserJoined', (newUserJoined: string) => {
      //   console.log(`New user in room:`, newUserJoined);
      // });

        this.hubConnection.on('MessageReceived', (msg: { user: string; text: string; isAnswer?: boolean }) => {
          console.log('Message received from hub:', msg);
          const currentPlayerName = localStorage.getItem("playerName") || "";
          const chatMessage: ChatMessage = {
            text: msg.text,
            sender: msg.user,
            timestamp: new Date(),
            ownMessage: msg.user === currentPlayerName,
            isAnswer: msg.isAnswer
          };
          this.messages$.next(chatMessage);
        });

        this.hubConnection.on('roomUpdated', (roomUpdated: RoomState) => {
          this.roomState$.next(roomUpdated);
        });

      console.log('Connected to SignalR hub');
    } catch (err) {
      console.error('Error connecting to hub:', err);
    }
  }

  // Check if the connection is established
  isHubConnected(): boolean {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  createRoom(owner:string,numberOfPictures:number) {
    return this.invoke("CreateRoom", owner, numberOfPictures);
  }

  async joinRoom(roomId: string, username: string) {
    let roomState = await this.invoke("JoinRoom", roomId, username)
    this.roomState$.next(roomState);
    return roomState;
  }

  invoke(method: string, ...args: any[]) {
    return this.hubConnection.invoke(method, ...args);
  }
}
