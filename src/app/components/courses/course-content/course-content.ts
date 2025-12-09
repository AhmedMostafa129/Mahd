import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { LessonService } from '../../../core/services/LectureService/lecture-service';
import { EnrollmentService } from '../../../core/services/Enrollment/enrollment';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { FileService } from '../../../core/services/FileService/file-service';
import { CourseDto } from '../../../core/interfaces/course.interface';
import { LessonDto, LessonContentType } from '../../../core/interfaces/lesson.interface';
import { EnrollmentDto } from '../../../core/interfaces/enrollment.interface';

@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-content.html',
  styleUrl: './course-content.scss',
})
export class CourseContent implements OnInit {
  readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _courseService = inject(CourseService);
  private readonly _lessonService = inject(LessonService);
  private readonly _enrollmentService = inject(EnrollmentService);
  private readonly _tokenService = inject(TokenService);
  private readonly _fileService = inject(FileService);

  // Data
  course = signal<CourseDto | null>(null);
  lessons = signal<LessonDto[]>([]);
  enrollment = signal<EnrollmentDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  completingLesson = signal<string | null>(null);

  // Current lesson
  currentLesson = signal<LessonDto | null>(null);

  ngOnInit(): void {
    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseContent(courseId);
    }
  }

  loadCourseContent(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);

    // Load course and lessons in parallel
    this._courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course.set(course);
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error.set(err.message || 'Failed to load course');
        this.loading.set(false);
      },
    });

    this._lessonService.getLessonsByCourse(courseId).subscribe({
      next: (result) => {
        this.lessons.set(result.items);
        if (result.items.length > 0) {
          this.currentLesson.set(result.items[0]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.error.set(err.message || 'Failed to load lessons');
        this.loading.set(false);
      },
    });

    // Load enrollment if user is authenticated
    const user = this._tokenService.getUser();
    if (user && user.userId) {
      this._enrollmentService.getEnrollmentsByStudent(user.userId).subscribe({
        next: (result) => {
          const enrollment = result.items.find((e) => e.courseId === courseId);
          if (enrollment) {
            this.enrollment.set(enrollment);
          }
        },
        error: (err) => {
          console.error('Error loading enrollment:', err);
        },
      });
    }
  }

  selectLesson(lesson: LessonDto): void {
    this.currentLesson.set(lesson);
  }

  markLessonComplete(lesson: LessonDto): void {
    const course = this.course();
    if (!course) return;

    this.completingLesson.set(lesson.lessonId);

    this._lessonService.markLessonAsComplete(course.courseId, lesson.lessonId).subscribe({
      next: () => {
        // Reload enrollment to update progress
        const user = this._tokenService.getUser();
        if (user && user.userId && this.enrollment()) {
          this._enrollmentService.getEnrollmentProgress(this.enrollment()!.enrollmentId).subscribe({
            next: (updatedEnrollment) => {
              this.enrollment.set(updatedEnrollment);
            },
          });
        }
        this.completingLesson.set(null);
      },
      error: (err) => {
        console.error('Error completing lesson:', err);
        this.error.set(err.message || 'Failed to complete lesson');
        this.completingLesson.set(null);
      },
    });
  }

  isLessonCompleted(lessonId: string): boolean {
    // This would need to be implemented based on backend data
    // For now, return false
    return false;
  }

  getContentTypeLabel(contentType: LessonContentType): string {
    const labels: { [key: number]: string } = {
      0: '🎥 Video',
      1: '🔴 Live Session',
      2: '📄 PDF Summary',
      3: '📚 E-Book',
      4: '📝 Quiz',
    };
    return labels[contentType] || '📄 Content';
  }

  resolveContentUrl(contentUrl?: string | null): string | null {
    if (!contentUrl) return null;
    // If it's already a full URL, return as-is
    if (/^https?:\/\//i.test(contentUrl) || contentUrl.startsWith('/')) {
      return contentUrl;
    }
    // Otherwise treat it as a file id and build URL via FileService
    try {
      return this._fileService.getFileUrl(contentUrl);
    } catch {
      return contentUrl;
    }
  }

  navigateToCourseDetails(): void {
    const course = this.course();
    if (course) {
      this._router.navigate(['/courses', course.courseId]);
    }
  }
}
