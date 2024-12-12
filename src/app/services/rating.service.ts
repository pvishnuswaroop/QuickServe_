import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private baseUrl = 'https://localhost:7009';

  constructor(private http: HttpClient) {}

  // Add rating
  addRating(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Rating`, payload);
  }

  // Fetch ratings for a user (without menu details)
  getRatingsByUserIdWithoutMenu(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Rating/user/${userId}/no-menu`);
  }
}
