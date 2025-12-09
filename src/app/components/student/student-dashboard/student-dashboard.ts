import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/DashboardService/dashboard-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { StudentDashboardDto } from '../../../core/interfaces/dashboard.interface';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  private readonly _router = inject(Router);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _tokenService = inject(TokenService);
  private readonly _authService = inject(AuthService);

  // Dashboard data
  dashboardData = signal<StudentDashboardDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

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

    this._dashboardService.getStudentDashboard(user.userId).subscribe({
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

  // Getters for template
  get stats() {
    const data = this.dashboardData();
    return {
      totalEnrollments: data?.totalEnrollments || 0,
      completedCourses: data?.completedCourses || 0,
      inProgressCourses: data?.inProgressCourses || 0,
      averageProgress: data?.averageProgress || 0
    };
  }

  get recentEnrollments() {
    return this.dashboardData()?.recentEnrollments || [];
  }

  get upcomingExams() {
    return this.dashboardData()?.upcomingExams || [];
  }

  // Navigation methods
  navigateToCourse(courseId: string): void {
    this._router.navigate(['/courses', courseId]);
  }

  navigateToMyCourses(): void {
    this._router.navigate(['/student/my-courses']);
  }

  navigateToExam(examId: string): void {
    this._router.navigate(['/student/exams', examId]);
  }

  navigateToCertificates(): void {
    this._router.navigate(['/student/my-certificates']);
  }

  navigateToProgress(): void {
    this._router.navigate(['/student/progress-tracking']);
  }

  handleSignOut(): void {
    this._authService.logout().subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: () => {
        // Even if logout fails, clear local data and redirect
        this._tokenService.clearAll();
        this._router.navigate(['/login']);
      }
    });
  }
}
