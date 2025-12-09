import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/DashboardService/dashboard-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { AdminDashboardDto } from '../../../core/interfaces/dashboard.interface';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private readonly _router = inject(Router);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _tokenService = inject(TokenService);
  private readonly _authService = inject(AuthService);

  // Dashboard data
  dashboardData = signal<AdminDashboardDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this._dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error.set(err.message || 'Failed to load dashboard data');
        this.loading.set(false);
      }
    });
  }

  // Helper to format revenue
  formatRevenue(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Helper to get month name
  getMonthName(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  }

  // Helper to calculate growth bar height
  getGrowthHeight(newUsers: number): number {
    const data = this.dashboardData();
    if (!data || data.userGrowthByMonth.length === 0) return 0;
    const maxUsers = Math.max(...data.userGrowthByMonth.map(g => g.newUsers));
    return maxUsers > 0 ? (newUsers / maxUsers) * 100 : 0;
  }

  // Navigation methods
  navigateToUsers(): void {
    this._router.navigate(['/admin/users']);
  }

  navigateToCourses(): void {
    this._router.navigate(['/admin/courses']);
  }

  navigateToPayments(): void {
    this._router.navigate(['/admin/payments']);
  }

  navigateToSupport(): void {
    this._router.navigate(['/admin/support']);
  }

  navigateToReports(): void {
    this._router.navigate(['/admin/reports']);
  }

  navigateToGroups(): void {
    this._router.navigate(['/admin/groups']);
  }

  navigateToContent(): void {
    this._router.navigate(['/admin/content']);
  }

  navigateToAnalytics(): void {
    this._router.navigate(['/admin/analytics']);
  }

  handleSignOut(): void {
    this._authService.logout().subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: () => {
        this._tokenService.clearAll();
        this._router.navigate(['/login']);
      }
    });
  }
}
