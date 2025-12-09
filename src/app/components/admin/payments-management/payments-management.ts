import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/Payment/payment';
import { PaymentDto, PaymentStatisticsDto, PagedResult } from '../../../core/interfaces/payment.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';

@Component({
  selector: 'app-payments-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments-management.html',
  styleUrl: './payments-management.scss',
})
export class PaymentsManagement implements OnInit {
  private readonly _paymentService = inject(PaymentService);
  private readonly _tokenService = inject(TokenService);

  payments = signal<PaymentDto[]>([]);
  statistics = signal<PaymentStatisticsDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  refundAmount = signal<number | null>(null);
  refundingPaymentId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPayments();
    this.loadStatistics();
  }

  loadPayments(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    // For admin, we need to get all payments. Since there's no direct endpoint,
    // we'll need to implement a workaround or add an endpoint
    // For now, we'll show a message that this needs backend support
    this.loading.set(false);
    this.error.set('Admin payments list endpoint needed. Please use course-specific payments.');
  }

  loadStatistics(): void {
    this._paymentService.getPaymentStatistics().subscribe({
      next: (stats) => {
        this.statistics.set(stats);
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadPayments(page);
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'succeeded':
      case 'completed':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'failed':
      case 'cancelled':
        return 'status-failed';
      default:
        return 'status-default';
    }
  }

  openRefundModal(paymentId: string): void {
    this.refundingPaymentId.set(paymentId);
    this.refundAmount.set(null);
  }

  closeRefundModal(): void {
    this.refundingPaymentId.set(null);
    this.refundAmount.set(null);
  }

  processRefund(): void {
    const paymentId = this.refundingPaymentId();
    const amount = this.refundAmount();

    if (!paymentId) return;

    this._paymentService.refundPayment(paymentId, amount || undefined).subscribe({
      next: () => {
        alert('Refund processed successfully');
        this.closeRefundModal();
        this.loadPayments(this.pageNumber());
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error processing refund:', err);
        this.error.set(err.message || 'Failed to process refund');
      },
    });
  }
}

