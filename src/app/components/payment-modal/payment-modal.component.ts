import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-modal',
  standalone:true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css'
})
export class PaymentModalComponent {
  selectedMethod: number = 0;
  paymentMethods = [
    { value: 0, label: 'Credit Card' },
    { value: 1, label: 'Debit Card' },
    { value: 2, label: 'PayPal' },
    { value: 3, label: 'Cash on Delivery' }
  ];

  constructor(
    private paymentService: PaymentService,
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orderID: number; userID: number; amount: number }
  ) {}

  makePayment(): void {
    const payload = {
      orderID: this.data.orderID,
      userID: this.data.userID,
      amountPaid: this.data.amount,
      paymentMethod: this.selectedMethod
    };

    this.paymentService.makePayment(payload).subscribe({
      next: () => {
        alert('Payment Successful!');
        this.dialogRef.close(true);
      },
      error: () => {
        alert('Payment Failed. Please try again.');
        this.dialogRef.close(false); 
      }
    });
  }
}
