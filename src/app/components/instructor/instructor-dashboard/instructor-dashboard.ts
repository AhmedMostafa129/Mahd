import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/DashboardService/dashboard-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { InstructorDashboardDto } from '../../../core/interfaces/dashboard.interface';
import { AuthService } from '../../../core/services/auth/auth-service';
import { InstructorService } from '../../../core/services/InstructorService/instructor-service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboard implements OnInit {
  private readonly _router = inject(Router);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _tokenService = inject(TokenService);
  private readonly _authService = inject(AuthService);
  private readonly _instructorService = inject(InstructorService);

  // Dashboard data
  dashboardData = signal<InstructorDashboardDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  profilePhotoUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._dashboardService.getInstructorDashboard(user.userId).subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);

        // Try to load public instructor profile for avatar
        this._instructorService.getPublicInstructor(user.userId).subscribe({
          next: (instr) => {
            this.profilePhotoUrl.set(instr?.photoUrl || null);
          },
          error: () => {
            // ignore avatar load errors silently
          }
        });
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error.set(err.message || 'Failed to load dashboard data');
        this.loading.set(false);
      }
    });
  }

  // Getters for template
  get stats() {
    const data = this.dashboardData();
    return {
      totalCourses: data?.totalCourses || 0,
      publishedCourses: data?.publishedCourses || 0,
      totalStudents: data?.totalStudents || 0,
      totalRevenue: data?.totalRevenue || 0,
      averageRating: data?.averageCourseRating || 0
    };
  }

  get topCourses() {
    return this.dashboardData()?.topCourses || [];
  }

  get revenueByMonth() {
    return this.dashboardData()?.revenueByMonth || [];
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

  // Helper to calculate revenue bar height
  getRevenueHeight(revenue: number): number {
    const data = this.dashboardData();
    if (!data || data.revenueByMonth.length === 0) return 0;
    const maxRevenue = Math.max(...data.revenueByMonth.map(m => m.revenue));
    return maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  }

  // Navigation methods
  navigateToDashboard(): void {
    this._router.navigate(['/instructor']);
  }

  navigateToCourses(): void {
    this._router.navigate(['/instructor/courses']);
  }

  navigateToExams(): void {
    this._router.navigate(['/instructor/exams']);
  }

  navigateToCreateCourse(): void {
    this._router.navigate(['/instructor/courses/create']);
  }

  navigateToCourse(courseId: string): void {
    this._router.navigate(['/instructor/courses', courseId]);
  }

  navigateToEarnings(): void {
    this._router.navigate(['/instructor/earnings']);
  }

  navigateToGroups(): void {
    this._router.navigate(['/instructor/groups']);
  }

  navigateToProfile(instructorId: string | undefined | null, event?: Event): void {
    if (!instructorId) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this._router.navigate(['/profile', instructorId]);
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
