import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../services/restaurant.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { MenuModalComponent } from '../../components/menu-modal/menu-modal.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading = true;

  constructor(private restaurantService: RestaurantService,
    private menuService: MenuService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.restaurantService.fetchRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
        this.isLoading = false;
      },
    });
  }

  // Open Menu Modal
  viewMenu(restaurantId: number) {
    this.menuService.getSortedMenu(restaurantId).subscribe({
      next: (menu) => {
        this.dialog.open(MenuModalComponent, {
          data: { menu },
          width: '600px',
        });
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      },
    });
  }
}

