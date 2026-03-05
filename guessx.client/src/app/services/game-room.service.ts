import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameRoomService {
  // create a subject to emit revealWholeImage event, that will be listened by the image viewer component
  private revealWholeImageSubject = new Subject<void>();

  // Observable to allow other components to listen to the revealWholeImage event
  public revealWholeImage$ = this.revealWholeImageSubject.asObservable();

  // Method to emit the revealWholeImage event
  revealWholeImage(): void {
    this.revealWholeImageSubject.next();
  }
}
