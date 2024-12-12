import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RatingModalComponent } from '../../components/rating-modal/rating-modal.component';
import { RatingService } from '../../services/rating.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'], // Fixed typo
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  userId: number | null = null;

  constructor(
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.fetchOrders();
    } else {
      alert('Please log in to view your orders.');
    }
  }

  openRatingModal(order: any): void {
    const dialogRef = this.dialog.open(RatingModalComponent, {
      data: { order },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrders(); // Refresh orders after rating
      }
    });
  }

  fetchOrders(): void {
    this.orderService
      .getOrdersByUserId(this.userId!)
      .pipe(
        switchMap((orders) => {
          this.orders = orders.map((order) => ({
            ...order,
            restaurantName: '',
            itemDetails: [],
            rating: null,
          }));

          const restaurantRequests = this.orders.map((order) =>
            this.restaurantService
              .getRestaurantById(order.restaurantID)
              .pipe(catchError(() => of({ name: 'Unknown Restaurant' })))
          );

          const menuRequests = this.orders.flatMap((order) =>
            order.orderItems.map((item: any) =>
              this.menuService
                .getMenuById(item.menuID)
                .pipe(
                  catchError(() =>
                    of({
                      itemName: 'Unknown Item',
                      price: 'Price unavailable',
                    })
                  )
                )
            )
          );

          const ratingRequest = this.ratingService
            .getRatingsByUserIdWithoutMenu(this.userId!)
            .pipe(catchError(() => of([])));

          return forkJoin([
            forkJoin(restaurantRequests),
            forkJoin(menuRequests),
            ratingRequest,
          ]);
        })
      )
      .subscribe({
        next: ([restaurantResponses, menuResponses, ratings]) => {
          this.orders.forEach((order, index) => {
            order.restaurantName = restaurantResponses[index]?.name || '';
          });

          let menuIndex = 0;
          this.orders.forEach((order) => {
            order.orderItems.forEach((item: any) => {
              const menu = menuResponses[menuIndex++];
              order.itemDetails.push({
                itemName: menu.itemName,
                quantity: item.quantity,
                price: menu.price,
              });
            });
          });

          ratings.forEach((rating: any) => {
            const order = this.orders.find((o) => o.orderID === rating.orderID);
            if (order) {
              order.rating = rating;
            }
          });
        },
        error: (err) => {
          console.error('Error fetching orders:', err.error.message);
        },
      });
  }
}
