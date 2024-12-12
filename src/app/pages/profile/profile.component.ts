import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatFormField, FormsModule, RouterLink, MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userDetails: any = {};
  isEditing: boolean = false;
  id: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.id = this.authService.getUserId(); 
    if (this.id) {
      this.authService.getUserDetails(this.id).subscribe({
        next: (user) => {
          this.userDetails = {
            name: user.name,
            email: user.email,
            contactNumber: user.contactNumber
          };
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          alert('Failed to fetch user details. Please try again later.');
        },
      });
    } else {
      alert('Please log in to view your profile.');
      this.router.navigate(['/login']);
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  saveUserDetails(): void {
    const updatedUser = {
      name: this.userDetails.name,
      email: this.userDetails.email,
      contactNumber: this.userDetails.contactNumber,
      password: this.userDetails.password || '', // Only include password if user changes it
    };

    this.authService.updateUserDetails(this.id!, updatedUser).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.isEditing = false;
        this.fetchUserDetails(); 
      },
      error: (err) => {
        console.error('Error updating user details:', err);
        alert('Failed to update profile. Please try again later.');
      },
    });
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']); 
  }

  cancelEdit(): void {
    this.isEditing = false; 
  }
}
