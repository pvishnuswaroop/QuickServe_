import { Component, OnInit } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  ratings: any[] = [];
  userId: number | null = null;

  constructor(
    private ratingService: RatingService,
    private authService: AuthService, 
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.fetchRatings();
  }

  fetchRatings(): void {
    this.userId = this.authService.getUserId();
    
    if (this.userId) {
      // Fetch ratings for the logged-in user by passing the dynamic userId
      this.ratingService.getRatingsByUserIdWithoutMenu(this.userId).subscribe({
        next: (response: any) => {
          this.ratings = response;

          // Fetch restaurant names for each rating using the rating's restaurantID
          this.ratings.forEach((rating) => {
            this.restaurantService.getRestaurantById(rating.restaurantID).subscribe({
              next: (restaurant) => {
                // Store the restaurant name in the rating object
                rating.restaurantName = restaurant.name;
              },
              error: () => {
                console.error('Failed to fetch restaurant data for rating ID:', rating.id);
              }
            });
          });
        },
        error: () => {
          console.error('Failed to fetch ratings.');
        }
      });
    } else {
      console.error('User is not logged in.');
    }
  }
}
