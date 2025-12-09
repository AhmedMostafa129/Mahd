import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { PaymentService } from '../../../core/services/Payment/payment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { PaymentDto, PagedResult } from '../../../core/interfaces/payment.interface';

@Component({
  selector: 'app-student-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class StudentPayments implements OnInit {
  private readonly _paymentService = inject(PaymentService);
  private readonly _tokenService = inject(TokenService);

  payments = signal<PaymentDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(page: number = 1): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._paymentService
      .getPaymentsByStudent(user.userId, page, this.pageSize())
      .subscribe({
        next: (result: PagedResult<PaymentDto>) => {
          this.payments.set(result.items);
          this.pageNumber.set(result.pageNumber);
          this.pageSize.set(result.pageSize);
          this.totalPages.set(result.totalPages);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading payments:', err);
          this.error.set(err.message || 'Failed to load payments');
          this.loading.set(false);
        },
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.loadPayments(page);
  }

  formatAmount(payment: PaymentDto): string {
    const amount = payment.amount?.toFixed(2) ?? '0.00';
    return `${amount} ${payment.currency?.toUpperCase() || 'USD'}`;
  }
}


