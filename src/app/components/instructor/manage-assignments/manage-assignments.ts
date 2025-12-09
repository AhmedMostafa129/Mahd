import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { ExamDto } from '../../../core/interfaces/exam.interface';
import { CourseDto } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-manage-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-assignments.html',
  styleUrl: './manage-assignments.scss',
})
export class ManageAssignments implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);
  private readonly _courseService = inject(CourseService);

  courseId = signal<string | null>(null);
  course = signal<CourseDto | null>(null);
  exams = signal<ExamDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  deleting = signal<string | null>(null);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.loadCourse(id);
      this.loadExams(id);
    }
  }

  loadCourse(id: string): void {
    this._courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
      },
      error: (err) => {
        console.error('Error loading course:', err);
      },
    });
  }

  loadExams(courseId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._examService.getExamsByCourse(courseId).subscribe({
      next: (result: any) => {
        // Debug: raw response to help debug proxy responses
        console.log('[ManageAssignments] getExamsByCourse response:', result);
        // Support multiple response shapes: plain array, { items: [...] }, { data: [...] }
        if (Array.isArray(result)) {
          this.exams.set(result || []);
        } else if (Array.isArray(result.items)) {
          this.exams.set(result.items || []);
        } else if (Array.isArray(result.data)) {
          this.exams.set(result.data || []);
        } else if (result && Array.isArray(result.data?.data)) {
          this.exams.set(result.data.data || []);
        } else {
          const possibleArray =
            result && typeof result === 'object'
              ? Object.values(result).find((v) => Array.isArray(v))
              : null;
          if (Array.isArray(possibleArray)) {
            this.exams.set(possibleArray as any[]);
          } else {
            this.exams.set([]);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading exams:', err);
        this.error.set(err.message || 'Failed to load exams');
        this.loading.set(false);
      },
    });
  }

  createExam(): void {
    const id = this.courseId();
    if (id) {
      this._router.navigate(['/instructor/exams/create'], { queryParams: { courseId: id } });
    }
  }

  editExam(examId: string): void {
    this._router.navigate(['/instructor/exams', examId, 'edit']);
  }

  viewExamQuestions(examId: string): void {
    this._router.navigate(['/instructor/exams', examId, 'questions']);
  }

  deleteExam(examId: string): void {
    if (!confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    this.deleting.set(examId);

    this._examService.deleteExam(examId).subscribe({
      next: () => {
        this.exams.set(this.exams().filter((e) => e.examId !== examId));
        this.deleting.set(null);
      },
      error: (err) => {
        console.error('Error deleting exam:', err);
        this.error.set(err.message || 'Failed to delete exam');
        this.deleting.set(null);
      },
    });
  }

  navigateToCourse(): void {
    const id = this.courseId();
    if (id) {
      this._router.navigate(['/instructor/courses', id]);
    }
  }
}
