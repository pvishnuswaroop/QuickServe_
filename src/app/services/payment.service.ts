import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://localhost:7009/api/Payment';

  constructor(private http: HttpClient) {}

  makePayment(payload: { orderID: number; userID: number; amountPaid: number; paymentMethod: number }): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }
}
