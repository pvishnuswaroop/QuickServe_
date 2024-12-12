import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './menu-modal.component.html',
  styleUrl: './menu-modal.component.css'
})
export class MenuModalComponent implements OnInit {

  

  cart: { [menuID: number]: number } = {}; 
  userId: number | null = null;
  cartRestaurantId: number | null = null; 


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { menu: any[] },
    private cartService: CartService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.userId = this.authService.getUserId(); // Extract user ID from JWT token
    console.log('User ID:', this.userId); // Debug log
  if (!this.userId) {
    console.error('User ID not available. Ensure the user is logged in.');
  }
    if (this.userId) {
      this.cartService.getCartForUser(this.userId).subscribe({
        next: (cart) => {
          cart.cartItems.forEach((item: any) => {
            this.cart[item.menuID] = item.quantity; // Initialize cart quantities
          });

          console.log('Cart Response:', cart);

          // if (cart.cartItems && cart.cartItems.length > 0 && cart.cartItems[0].menu) {
          //   this.cartRestaurantId = cart.cartItems[0].menu.restaurantID; // Derive restaurant ID
          //   console.log('Cart Restaurant ID:', this.cartRestaurantId);
          // } else {
          //   console.warn('Cart is empty or menu data is missing.');
          // this.cartRestaurantId = null; 
          // }

          if (cart.cartItems && cart.cartItems.length > 0) {
            const firstItem = cart.cartItems[0];
            if (firstItem.menu && firstItem.menu.restaurantID) {
              this.cartRestaurantId = firstItem.menu.restaurantID;
            } else {
              console.warn('Menu data is missing for the first cart item.');
              this.cartRestaurantId = null;
            }
          } else {
            console.warn('Cart is empty.');
            this.cartRestaurantId = null;
          }
          
        },
        error: (err) => console.error('Error fetching cart:', err),
      });
    }
  
  }


//     const existingRestaurantId = this.cartRestaurantId;

//     // Handle restaurant mismatch
//   if (existingRestaurantId && existingRestaurantId !== menu.restaurantID) {
//     if (confirm('Your cart contains items from another restaurant. Do you want to clear the cart?')) {
//       this.clearCart();
//       this.cartRestaurantId = menu.restaurantID; // Set new restaurant ID
//     } else {
//       return; // Exit without adding the item
//     }
//   }

//     if (!this.cart[menu.menuID]) {
//       this.cart[menu.menuID] = 1; // Default quantity
//       this.cartRestaurantId = menu.restaurantID;
//     }
//     this.updateCart(menu);
//   }

  
  updateQuantity(menu: any, increment: boolean) {
    if (increment) {
      this.cart[menu.menuID]++;
    } else {
      this.cart[menu.menuID]--;
      if (this.cart[menu.menuID] <= 0) {
        delete this.cart[menu.menuID]; // Remove from cart if quantity <= 0
        return;
      }
    }
    const quantity = this.cart[menu.menuID];
    this.updateCart(menu, quantity);
  }



addToCart(menu: any) {
  if (!this.userId) {
    alert('Please log in to add items to your cart.');
    return;
  }

  this.cartService.getCartForUser(this.userId).subscribe({
    next: (cart) => {
      const cartItem = cart.cartItems.find((item: any) => item.menuID === menu.menuID);
      
      //this.cartRestaurantId = cart.cartItems[0].menu.restaurantID;

      if (cartItem) {
        this.updateCart(menu, cartItem.quantity + 1);
      } else {
        this.addItemToCart(menu);
      }
    },
    error: (err) => {
      console.error('Error fetching cart:', err);
    },
  });
}


updateCart(menu: any, quantity: number) {
  this.cartService.updateCartItem(this.userId!, menu.menuID, quantity).subscribe({
    next: () => {
      console.log('Cart item updated successfully.');
      this.refreshCart();
    },
    error: (err) => {
      console.error('Error updating cart item:', err.error.message);
    },
  });
}


addItemToCart(menu: any) {

  const cartMenuItems = this.getCartMenuItemsFromLocalStorage();

  cartMenuItems[menu.menuID] = menu.itemName; 

  localStorage.setItem('cartMenuItems', JSON.stringify(cartMenuItems));
  const payload = { menuID: menu.menuID, quantity: 1, price: menu.price };

  this.cartService.addToCart(this.userId!, payload).subscribe({
    next: () => {
      console.log('Item added to cart successfully.');
      this.cartRestaurantId = menu.restaurantID;
      this.refreshCart();
    },
    error: (err) => {
      console.error('Error adding item to cart:', err.error.message);
    },
  });
}

getCartMenuItemsFromLocalStorage(): { [menuID: number]: string } {
  const storedItems = localStorage.getItem('cartMenuItems');
  return storedItems ? JSON.parse(storedItems) : {};
}

  

clearCart() {
  this.cart = {}; 
  this.cartRestaurantId = null; 
  this.cartService.clearCart(this.userId!).subscribe({
    next: () => {
      console.log('Cart cleared successfully.');
    },
    error: (err) => {
      console.error('Error clearing cart:', err);
    },
  });
}


refreshCart() {
  this.cartService.getCartForUser(this.userId!).subscribe({
    next: (cart) => {
      this.cart = cart.cartItems.reduce((acc: any, item: any) => {
        acc[item.menuID] = item.quantity;
        return acc;
      }, {});
    },
    error: (err) => {
      console.error('Error refreshing cart:', err.error.message);
    },
  });
}

}
