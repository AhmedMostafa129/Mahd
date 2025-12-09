import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { EnrollmentService } from '../../../core/services/Enrollment/enrollment';
import { LessonService } from '../../../core/services/LectureService/lecture-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CourseDto } from '../../../core/interfaces/course.interface';
import { LessonDto } from '../../../core/interfaces/lesson.interface';
import { CourseReviews } from '../course-reviews/course-reviews';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, CourseReviews],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails implements OnInit {
  readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _courseService = inject(CourseService);
  private readonly _enrollmentService = inject(EnrollmentService);
  private readonly _lessonService = inject(LessonService);
  private readonly _tokenService = inject(TokenService);

  // Data
  course = signal<CourseDto | null>(null);
  lessons = signal<LessonDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  enrolling = signal<boolean>(false);

  // User state
  isAuthenticated = signal<boolean>(false);
  isEnrolled = signal<boolean>(false);
  enrollmentId = signal<string | null>(null);

  ngOnInit(): void {
    this.isAuthenticated.set(this._tokenService.isAuthenticated());

    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
      this.loadLessons(courseId);
      if (this.isAuthenticated()) {
        this.checkEnrollment(courseId);
      }
    }
  }

  loadCourseDetails(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error.set(err.message || 'Failed to load course details');
        this.loading.set(false);
      }
    });
  }

  loadLessons(courseId: string): void {
    this._lessonService.getLessonsByCourse(courseId).subscribe({
      next: (result) => {
        this.lessons.set(result.items);
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
      }
    });
  }

  checkEnrollment(courseId: string): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) return;

    this._enrollmentService.getEnrollmentsByStudent(user.userId).subscribe({
      next: (result) => {
        const enrollment = result.items.find(e => e.courseId === courseId);
        if (enrollment) {
          this.isEnrolled.set(true);
          this.enrollmentId.set(enrollment.enrollmentId);
        }
      },
      error: (err) => {
        console.error('Error checking enrollment:', err);
      }
    });
  }

  enrollInCourse(): void {
    const course = this.course();
    if (!course) return;

    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this._router.navigate(['/login'], { queryParams: { returnUrl: this._router.url } });
      return;
    }

    this.enrolling.set(true);

    this._enrollmentService.enrollInCourse({
      studentId: user.userId,
      courseId: course.courseId
    }).subscribe({
      next: (enrollment) => {
        this.isEnrolled.set(true);
        this.enrollmentId.set(enrollment.enrollmentId);
        this.enrolling.set(false);
        // Navigate to course content
        this._router.navigate(['/courses', course.courseId, 'content']);
      },
      error: (err) => {
        console.error('Error enrolling:', err);
        this.error.set(err.message || 'Failed to enroll in course');
        this.enrolling.set(false);
      }
    });
  }

  navigateToContent(): void {
    const course = this.course();
    if (course) {
      this._router.navigate(['/courses', course.courseId, 'content']);
    }
  }

  navigateToProfile(instructorId: string | undefined | null, event?: Event): void {
    if (!instructorId) return;
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this._router.navigate(['/profile', instructorId]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  }

  getContentTypeLabel(contentType: any): string {
    // If it's already a clean string label, return it
    if (typeof contentType === 'string' && isNaN(Number(contentType))) {
      return contentType;
    }

    // Map numeric values to labels
    const types: { [key: number]: string } = {
      0: 'Video',
      1: 'Live Session',
      2: 'PDF Summary',
      3: 'E-Book',
      4: 'Quiz'
    };

    return types[Number(contentType)] || 'Lesson';
  }
}
