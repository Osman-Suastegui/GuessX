import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-id-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-id-dialog.component.html',
  styleUrl: './room-id-dialog.component.css'
})
export class RoomIdDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RoomIdDialogComponent>);
  readonly data = inject<string | null>(MAT_DIALOG_DATA);

  roomId: string = '';

  constructor() {
    // If data is provided, pre-fill the roomId
    if (this.data) {
      this.roomId = this.data;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onJoin(): void {
    if (this.roomId.trim().length > 0) {
      this.dialogRef.close(this.roomId.trim());
    }
  }

  isRoomIdValid(): boolean {
    return this.roomId.trim().length > 0;
  }
}

