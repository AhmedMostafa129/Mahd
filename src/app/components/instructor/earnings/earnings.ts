import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { PaymentService } from '../../../core/services/Payment/payment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { PaymentDto, PagedResult } from '../../../core/interfaces/payment.interface';
import { CourseDto } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.html',
  styleUrl: './earnings.scss',
})
export class Earnings implements OnInit {
  private readonly _paymentService = inject(PaymentService);
  private readonly _tokenService = inject(TokenService);
  private readonly _courseService = inject(CourseService);

  courses = signal<CourseDto[]>([]);
  payments = signal<PaymentDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  totalRevenue = signal<number>(0);
  selectedCourseId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this._courseService.getCoursesByInstructor(user.userId, 1, 100).subscribe({
      next: (result) => {
        this.courses.set(result.items);
        this.calculateTotalRevenue();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      },
    });
  }

  loadPaymentsForCourse(courseId: string): void {
    this.selectedCourseId.set(courseId);
    this._paymentService.getPaymentsByCourse(courseId, 1, 100).subscribe({
      next: (result: PagedResult<PaymentDto>) => {
        this.payments.set(result.items);
      },
      error: (err) => {
        console.error('Error loading payments:', err);
      },
    });
  }

  calculateTotalRevenue(): void {
    // Calculate total revenue from all courses
    // This is a simplified version - you might want to get actual payment data
    const total = this.courses().reduce((sum, course) => {
      return sum + (course.price * (course.enrollmentCount || 0));
    }, 0);
    this.totalRevenue.set(total);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
