import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details-dialog',
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss'],
  standalone: false,
})
/**
 * Dialog box containing details about a movie
 */
export class MovieDetailsDialogComponent {

  constructor(
        public dialogRef: MatDialogRef<MovieDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public movie: any
      ) {}
    
      closeDialog(): void {
        this.dialogRef.close();
      }

}