import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-address-model',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './address-model.component.html',
  styleUrl: './address-model.component.css'
})
export class AddressModelComponent {
  constructor(
    public dialogRef: MatDialogRef<AddressModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.data.address);
  }
}
