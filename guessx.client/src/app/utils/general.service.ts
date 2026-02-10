import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; // Asegúrate de importar esto

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, className: string = 'snackbar-info') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [className],
    });
  }
}
