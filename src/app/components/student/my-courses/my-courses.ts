import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EnrollmentService } from '../../../core/services/Enrollment/enrollment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { EnrollmentDto, PagedResult } from '../../../core/interfaces/enrollment.interface';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class MyCourses implements OnInit {
  private readonly _enrollmentService = inject(EnrollmentService);
  private readonly _tokenService = inject(TokenService);
  private readonly _router = inject(Router);

  enrollments = signal<EnrollmentDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(page: number = 1): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this._enrollmentService
      .getEnrollmentsByStudent(user.userId, page, this.pageSize())
      .subscribe({
        next: (result: PagedResult<EnrollmentDto>) => {
          this.enrollments.set(result.items);
          this.pageNumber.set(result.pageNumber);
          this.pageSize.set(result.pageSize);
          this.totalPages.set(result.totalPages);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading enrollments:', err);
          this.error.set(err.message || 'Failed to load enrollments');
          this.loading.set(false);
        },
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.loadEnrollments(page);
  }

  navigateToCourse(courseId: string): void {
    this._router.navigate(['/student/courses', courseId]);
  }

  navigateToProgress(enrollmentId: string): void {
    this._router.navigate(['/student/progress-tracking'], {
      queryParams: { enrollmentId },
    });
  }

  navigateToCertificate(enrollmentId: string): void {
    this._router.navigate(['/student/my-certificates'], {
      queryParams: { enrollmentId },
    });
  }
}
