import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../core/services/ReviewService/review-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CourseReviewDto, PagedResult } from '../../../core/interfaces/review.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-reviews.html',
  styleUrl: './course-reviews.scss',
})
export class CourseReviews implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _reviewService = inject(ReviewService);
  private readonly _tokenService = inject(TokenService);
  private readonly _router = inject(Router);

  @Input() courseId!: string;

  // Data
  reviews = signal<CourseReviewDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);

  // Pagination
  pageNumber = signal<number>(1);
  pageSize = signal<number>(5);
  totalCount = signal<number>(0);
  totalPages = signal<number>(0);

  // User state
  isAuthenticated = signal<boolean>(false);
  currentUserId = signal<string | null>(null);
  canReview = signal<boolean>(false);

  // Form
  reviewForm!: FormGroup;
  showReviewForm = signal<boolean>(false);

  // Rating hover state
  hoveredRating = signal<number>(0);

  ngOnInit(): void {
    this.isAuthenticated.set(this._tokenService.isAuthenticated());
    if (this.isAuthenticated()) {
      const user = this._tokenService.getUser();
      this.currentUserId.set(user?.userId || null);
    }

    this.initForm();
    this.loadReviews();
  }

  initForm(): void {
    this.reviewForm = this._fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  loadReviews(): void {
    if (!this.courseId) return;

    this.loading.set(true);
    this.error.set(null);

    this._reviewService.getCourseReviews(this.courseId, this.pageNumber(), this.pageSize()).subscribe({
      next: (result: PagedResult<CourseReviewDto>) => {
        this.reviews.set(result.items);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.error.set('Failed to load reviews');
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber.set(page);
    this.loadReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleReviewForm(): void {
    if (!this.isAuthenticated()) {
      this._router.navigate(['/login']);
      return;
    }
    this.showReviewForm.set(!this.showReviewForm());
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onMouseEnter(rating: number): void {
    this.hoveredRating.set(rating);
  }

  onMouseLeave(): void {
    this.hoveredRating.set(0);
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.currentUserId() || !this.courseId) return;

    this.submitting.set(true);
    const formValue = this.reviewForm.value;

    this._reviewService.createCourseReview({
      courseId: this.courseId,
      studentId: this.currentUserId()!,
      rating: formValue.rating,
      comment: formValue.comment
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showReviewForm.set(false);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.loadReviews(); // Reload reviews
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.error.set(err.error?.message || 'Failed to submit review');
        this.submitting.set(false);
      }
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  canDeleteReview(review: CourseReviewDto): boolean {
    return review.studentId === this.currentUserId();
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this._reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.loadReviews();
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.error.set('Failed to delete review');
      }
    });
  }
}
