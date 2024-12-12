import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'https://localhost:7009/api/Menu';

  constructor(private http: HttpClient) { }

  // Fetch menu by restaurant ID
  getMenuByRestaurantId(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }

  getMenuById(menuId: number): Observable<any> {
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`);
    return this.http.get<any>(`${this.apiUrl}/${menuId}`);
  }
  
  getSortedMenu(restaurantId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurant/${restaurantId}/sorted-menu`);
  }
  
}
