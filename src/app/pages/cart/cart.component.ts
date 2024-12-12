import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AddressModelComponent } from '../../components/address-model/address-model.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderService } from '../../services/order.service';
import { PaymentModalComponent } from '../../components/payment-modal/payment-modal.component';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  userId: number | null = null;
  cartRestaurantId: number | null = null;
  

  constructor(
    private cartService: CartService, 
    private authService: AuthService, 
    private dialog: MatDialog, 
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadCart();
  }


  loadCart() : void{
    this.userId = this.authService.getUserId();
    this.cartService.getCartForUser(this.userId!).subscribe({
      next: (cart) => {
        const cartMenuItems = this.getCartMenuItemsFromLocalStorage();
  
        this.cartItems = cart.cartItems.map((item: any) => ({
          ...item,
          itemName: cartMenuItems[item.menuID] || 'Unknown Item', // Fallback to 'Unknown Item' if not in local storage
        }));

        this.cartRestaurantId = cart.cartItems.length > 0 ? cart.cartItems[0].restaurantID : null;
        console.log('Cart Restaurant ID:', this.cartRestaurantId);
  
        console.log('Enriched Cart Items:', this.cartItems);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.cartItems = [];
        this.cartRestaurantId = null;
      },
    });
  }

  
getCartMenuItemsFromLocalStorage(): { [menuID: number]: string } {
  const storedItems = localStorage.getItem('cartMenuItems');
  return storedItems ? JSON.parse(storedItems) : {};
}

   
   removeItem(menuID: number) {
    if (!this.userId) return;

    this.cartService.removeItemFromCart(this.userId, menuID).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((item) => item.menuID !== menuID);
        console.log(`Item with menuID ${menuID} removed from cart.`);

      const cartMenuItems = this.getCartMenuItemsFromLocalStorage();
      delete cartMenuItems[menuID];
      localStorage.setItem('cartMenuItems', JSON.stringify(cartMenuItems));

      this.loadCart();
      },
      error: (err) => console.error('Error removing item:', err),
    });
  }

  
  updateQuantity(menuID: number, quantity: number) {
    if (!this.userId || quantity <= 0) return;

    const cartItem = this.cartItems.find((item) => item.menuID === menuID);
    if (cartItem) { 
      this.cartService.updateCartItem(this.userId, menuID, quantity).subscribe({
        next: () => {
          cartItem.quantity = quantity; 
          console.log('Cart item quantity updated.');
        },
        error: (err) => console.error('Error updating cart item:', err),
      });
    }
  }


  clearCart(): void {
    this.cartService.clearCart(this.userId!).subscribe({
      next: () => {
        console.log('Cart cleared successfully.');
  
        localStorage.removeItem('cartMenuItems');
        this.cartItems = []; 
        alert('Cart has been cleared.');
        
        this.loadCart();
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
      },
    });
  }
  

  placeOrder(): void {
    const dialogRef = this.dialog.open(AddressModelComponent, {
      width: '300px',
      data: { address: '' }
    });
  
    dialogRef.afterClosed().subscribe((address) => {
      if (address) {
        this.cartService.placeOrder(this.userId!, { address }).subscribe({
          next: (order) => {
            this.openPaymentModal(order.orderID, order.userID, this.getTotalAmount());
          },
          error: (err) => {
            console.error('Error placing order:', err.error.message);
            alert('Failed to place order. Please try again.');
          }
        });
      } else {
        alert('Address is required to place an order.');
      }
    });
  }
  
  openPaymentModal(orderID: number, userID: number, amount: number): void {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      data: { orderID, userID, amount }
    });
  
    // dialogRef.afterClosed().subscribe((paymentMethod) => {
    //   if (paymentMethod !== undefined) {
    //     this.paymentService.makePayment({
    //       orderID,
    //       userID,
    //       amountPaid: amount,
    //       paymentMethod
    //     }).subscribe({
    //       next: () => {
    //         alert('Payment successful and order placed!');
    //         this.clearCart();
    //       },
    //       error: () => {
    //         alert('Payment failed. Please try again.');
    //       }
    //     });
    //   } else {
    //     alert('Payment cancelled.');
    //   }
    // });
    dialogRef.afterClosed().subscribe((paymentSuccess) => {
      if (paymentSuccess) {
        alert('Order placed successfully!');
        this.clearCart();
      } else {
        alert('Order placed, but payment was not successful.');
      }
    });
  }
  


  isCartEmpty(): boolean {
    return this.cartItems.length === 0; 
  }
  
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  
}
