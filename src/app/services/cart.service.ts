import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7009/api';
  constructor(private http: HttpClient) { }

  
  getCartForUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Cart/user/${userId}`);
  }

  
  addToCart(userId: number, menuItem: { menuID: number; quantity: number; price: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Cart/user/${userId}`, menuItem);
  }


  
  removeItemFromCart(userId: number, menuID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cart/user/${userId}/item/${menuID}`);
  }

  
   updateCartItem(userId: number, menuId: number, quantity: number): Observable<any> {
    console.log('Updating cart item:', { userId, menuId, quantity }); // Debug log
    return this.http.put(`${this.apiUrl}/Cart/user/${userId}/item/${menuId}`, quantity);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cart/user/${userId}/clear`);
  }
  
  placeOrder(userId: number, payload: { address: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/dashboard/order/place-order?userId=${userId}`, payload);
  }
  

}
