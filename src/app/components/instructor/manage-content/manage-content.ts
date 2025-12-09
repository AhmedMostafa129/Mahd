import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../core/services/LectureService/lecture-service';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { LessonDto, LessonCreateDto, LessonContentType } from '../../../core/interfaces/lesson.interface';
import { CourseDto } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-content.html',
  styleUrl: './manage-content.scss',
})
export class ManageContent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _lessonService = inject(LessonService);
  private readonly _courseService = inject(CourseService);

  courseId = signal<string | null>(null);
  course = signal<CourseDto | null>(null);
  lessons = signal<LessonDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  deleting = signal<string | null>(null);

  // Content type options
  contentTypeOptions = [
    { value: LessonContentType.Video, label: 'Video' },
    { value: LessonContentType.LiveSession, label: 'Live Session' },
    { value: LessonContentType.PdfSummary, label: 'PDF Summary' },
    { value: LessonContentType.EBook, label: 'E-Book' },
    { value: LessonContentType.Quiz, label: 'Quiz' }
  ];

  publishing = signal<boolean>(false);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.loadCourse(id);
      this.loadLessons(id);
    }
  }

  loadCourse(id: string): void {
    this._courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
      },
      error: (err) => {
        console.error('Error loading course:', err);
      }
    });
  }

  togglePublishStatus(): void {
    const course = this.course();
    if (!course) return;

    if (course.isPublished) {
      if (!confirm('Are you sure you want to unpublish this course? It will be hidden from students.')) return;
      this.unpublishCourse(course.courseId);
    } else {
      if (!confirm('Ready to publish? Your course will be visible to all students.')) return;
      this.publishCourse(course.courseId);
    }
  }

  publishCourse(courseId: string): void {
    this.publishing.set(true);
    this._courseService.publishCourse(courseId).subscribe({
      next: () => {
        this.publishing.set(false);
        // Update local state
        this.course.update(c => c ? { ...c, isPublished: true } : null);
        alert('Course published successfully! 🚀');
      },
      error: (err) => {
        console.error('Error publishing course:', err);
        this.error.set(err.message || 'Failed to publish course');
        this.publishing.set(false);
      }
    });
  }

  unpublishCourse(courseId: string): void {
    this.publishing.set(true);
    this._courseService.unpublishCourse(courseId).subscribe({
      next: () => {
        this.publishing.set(false);
        // Update local state
        this.course.update(c => c ? { ...c, isPublished: false } : null);
      },
      error: (err) => {
        console.error('Error unpublishing course:', err);
        this.error.set(err.message || 'Failed to unpublish course');
        this.publishing.set(false);
      }
    });
  }

  loadLessons(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._lessonService.getLessonsByCourse(courseId).subscribe({
      next: (result) => {
        // Safety check: ensure we always have an array
        this.lessons.set(result?.items || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.error.set(err.message || 'Failed to load lessons');
        this.loading.set(false);
      }
    });
  }

  addLesson(): void {
    const id = this.courseId();
    if (id) {
      this._router.navigate(['/instructor/courses', id, 'lessons', 'create']);
    }
  }

  editLesson(lessonId: string): void {
    const courseId = this.courseId();
    if (courseId) {
      this._router.navigate(['/instructor/courses', courseId, 'lessons', lessonId, 'edit']);
    }
  }

  deleteLesson(lessonId: string): void {
    const courseId = this.courseId();
    if (!courseId) return;

    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    this.deleting.set(lessonId);

    this._lessonService.deleteLesson(courseId, lessonId).subscribe({
      next: () => {
        this.lessons.set(this.lessons().filter(l => l.lessonId !== lessonId));
        this.deleting.set(null);
      },
      error: (err) => {
        console.error('Error deleting lesson:', err);
        this.error.set(err.message || 'Failed to delete lesson');
        this.deleting.set(null);
      }
    });
  }

  getContentTypeLabel(contentType: LessonContentType | string): string {
    // If it's already a string label (e.g. from backend), try to match it or return it
    if (typeof contentType === 'string') {
      // Check if it matches one of our labels
      const match = this.contentTypeOptions.find(opt => opt.label.toLowerCase() === contentType.toLowerCase());
      if (match) return match.label;
      // Or if it matches a numeric value string
      if (!isNaN(Number(contentType))) {
        const numMatch = this.contentTypeOptions.find(opt => opt.value === Number(contentType));
        return numMatch ? numMatch.label : contentType;
      }
      return contentType;
    }

    // Valid numeric enum
    const option = this.contentTypeOptions.find(opt => opt.value === contentType);
    return option ? option.label : 'Unknown';
  }

  navigateToCourse(): void {
    const id = this.courseId();
    if (id) {
      this._router.navigate(['/instructor/courses', id]);
    }
  }
}
