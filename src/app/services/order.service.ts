import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7009/api';

  constructor(private http: HttpClient) {}

  getOrdersByUserId(userId: number): Observable<any[]> {
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`);
    return this.http.get<any[]>(`${this.apiUrl}/Order/user/${userId}`);
  }
}
