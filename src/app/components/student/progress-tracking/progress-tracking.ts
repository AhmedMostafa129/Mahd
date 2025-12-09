import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService } from '../../../core/services/Enrollment/enrollment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { EnrollmentDto, PagedResult } from '../../../core/interfaces/enrollment.interface';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-tracking.html',
  styleUrl: './progress-tracking.scss',
})
export class ProgressTracking implements OnInit {
  private readonly _enrollmentService = inject(EnrollmentService);
  private readonly _tokenService = inject(TokenService);
  private readonly _route = inject(ActivatedRoute);

  enrollments = signal<EnrollmentDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedEnrollment = signal<EnrollmentDto | null>(null);

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      this.loading.set(false);
      return;
    }

    const enrollmentIdFromQuery = this._route.snapshot.queryParamMap.get('enrollmentId');

    this.loading.set(true);
    this.error.set(null);

    this._enrollmentService
      .getEnrollmentsByStudent(user.userId, 1, 100)
      .subscribe({
        next: (result: PagedResult<EnrollmentDto>) => {
          this.enrollments.set(result.items);

          if (enrollmentIdFromQuery) {
            const found = result.items.find((e) => e.enrollmentId === enrollmentIdFromQuery);
            if (found) {
              this.selectedEnrollment.set(found);
            }
          }

          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading progress:', err);
          this.error.set(err.message || 'Failed to load progress data');
          this.loading.set(false);
        },
      });
  }

  selectEnrollment(enrollment: EnrollmentDto): void {
    this.selectedEnrollment.set(enrollment);
  }
}
