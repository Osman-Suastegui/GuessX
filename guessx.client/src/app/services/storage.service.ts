import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setPlayerName(name: string): void {
    localStorage.setItem('playerName', name);
  }

  getPlayerName(): string | null {
    return localStorage.getItem('playerName');
  }

  clearPlayerName(): void {
    localStorage.removeItem('playerName');
  }
}
