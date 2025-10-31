import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameSignalRService {
  private hubConnection!: signalR.HubConnection;
  public users$ = new BehaviorSubject<any[]>([]);

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

      console.log('Connected to SignalR hub');
    } catch (err) {
      console.error('Error connecting to hub:', err);
    }
  }

  createRoom() {
    return this.invoke("CreateRoom")
  }

  joinRoom(roomId: string, username: string) {
    return this.invoke("JoinRoom", roomId, username)
  }

  invoke(method: string, ...args: any[]) {
    return this.hubConnection.invoke(method, ...args);
  }
}
