import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { RoomState } from '../game-room/room.model';

@Injectable({
  providedIn: 'root'
})
export class GameSignalRService {
  private hubConnection!: signalR.HubConnection;
  public users$ = new BehaviorSubject<any[]>([]);
  public roomState$ = new BehaviorSubject<RoomState | null>(null);

  constructor() { }

  async startConnection(hubUrl: string) {
    console.log("Starting SignalR connection to:", hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      this.hubConnection.on('UserJoined', (newUserJoined: string) => {
        console.log(`New user in room:`, newUserJoined);
        const updatedUsers = [...this.users$.value, newUserJoined];
        this.users$.next(updatedUsers);
      });

        this.hubConnection.on('MessageReceived', (msg) => {
          console.log('Message received from hub:', msg);
        });

        this.hubConnection.on('roomUpdated', (roomUpdated: RoomState) => {
          this.roomState$.next(roomUpdated);
        });

      console.log('Connected to SignalR hub');
    } catch (err) {
      console.error('Error connecting to hub:', err);
    }
  }

  createRoom(owner:string) {
    return this.invoke("CreateRoom", owner);
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
