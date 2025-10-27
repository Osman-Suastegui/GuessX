import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class GameSignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor() { }

  async startConnection(hubUrl: string) {
    console.log("Starting SignalR connection to:", hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('Connected to SignalR hub');
    } catch (err) {
      console.error('Error connecting to hub:', err);
    }
  }

  invoke(method: string, ...args: any[]) {
    return this.hubConnection.invoke(method, ...args);
  }
}
