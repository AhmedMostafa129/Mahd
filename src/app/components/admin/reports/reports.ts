import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/DashboardService/dashboard-service';
import { AdminDashboardDto } from '../../../core/interfaces/dashboard.interface';
import { PaymentService } from '../../../core/services/Payment/payment';
import { PaymentStatisticsDto } from '../../../core/interfaces/payment.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  private readonly _dashboardService = inject(DashboardService);
  private readonly _paymentService = inject(PaymentService);
  private readonly _router = inject(Router);

  dashboardData = signal<AdminDashboardDto | null>(null);
  paymentStats = signal<PaymentStatisticsDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load dashboard data
    this._dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error.set(err.message || 'Failed to load reports');
        this.loading.set(false);
      },
    });

    // Load payment statistics
    this._paymentService.getPaymentStatistics().subscribe({
      next: (stats) => {
        this.paymentStats.set(stats);
      },
      error: (err) => {
        console.error('Error loading payment statistics:', err);
      },
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getMonthName(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  }

  navigateToProfile(instructorId: string | undefined | null, event?: Event): void {
    if (!instructorId) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this._router.navigate(['/profile', instructorId]);
  }

  getGrowthHeight(newUsers: number): string {
    const maxUsers = Math.max(...(this.dashboardData()?.userGrowthByMonth.map((g) => g.newUsers) || [1]));
    const percentage = (newUsers / maxUsers) * 100;
    return `${Math.max(percentage, 5)}%`;
  }

  exportData(): void {
    // Placeholder for export functionality
    alert('Export functionality will be implemented');
  }
}
