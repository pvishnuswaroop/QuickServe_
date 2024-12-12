import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RatingService } from '../../services/rating.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rating-modal.component.html',
  styleUrl: './rating-modal.component.css'
})
export class RatingModalComponent {
  ratingScore: number = 5;
  reviewText: string = '';

  constructor(
    private ratingService: RatingService,
    public dialogRef: MatDialogRef<RatingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submitRating(): void {
    const payload = {
      userID: this.data.order.userID,
      restaurantID: this.data.order.restaurantID,
      orderID: this.data.order.orderID,
      ratingScore: this.ratingScore,
      reviewText: this.reviewText
    };

    this.ratingService.addRating(payload).subscribe({
      next: () => {
        alert('Rating submitted successfully.');
        this.dialogRef.close(true);
      },
      error: () => {
        alert('Failed to submit rating.');
      }
    });
  }
}
