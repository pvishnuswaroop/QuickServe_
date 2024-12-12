import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  userName: string = ''; // Default username
  token: string | null = localStorage.getItem('token');
  cartItemCount: number = 0;
  userId: number | null = null;

  constructor(private cartService: CartService, private authService: AuthService, private location: Location, private http:HttpClient) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.cartService.getCartForUser(this.userId).subscribe({
        next: (cart) => {
          this.cartItemCount = cart.cartItems.length;
        },
        error: (err) => console.error('Error fetching cart count:', err),
      });
      this.fetchUserDetails(this.userId);
    }

  }

  isLoggedIn(): boolean {
    const isLogged = !!localStorage.getItem('jwtToken'); 
    return isLogged; 
  }

  fetchUserDetails(userId: number): void {
    this.http.get<any>(`https://localhost:7009/api/User/${userId}`).subscribe({
      next: (response) => {
        this.userName = response.name || 'Guest';
      },
      error: () => {
        console.error('Failed to fetch user details');
      }
    });
  }
  // goBack(): void {
  //   this.location.back(); 
  // }

  // goForward(): void {
  //   this.location.forward(); 
  // }

  logout(): void {
    localStorage.clear();
    window.location.reload(); // Clear user session and reload
  }
}
