import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import { CourseService } from '../../../core/services/CourseService/course-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { CreateExamDto } from '../../../core/interfaces/exam.interface';
import { CourseDto } from '../../../core/interfaces/course.interface';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.scss',
})
export class CreateExam implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);
  private readonly _courseService = inject(CourseService);
  private readonly _tokenService = inject(TokenService);

  courses = signal<CourseDto[]>([]);
  loading = signal<boolean>(false);
  courseId = signal<string | null>(null);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);

  // Form data
  examData: CreateExamDto = {
    title: '',
    description: '',
    courseId: '',
    durationMinutes: 60,
    passingPercentage: 60
  };

  ngOnInit(): void {
    // Load instructor courses
    this.loadInstructorCourses();
    
    // Get courseId from query params if provided
    const courseId = this._route.snapshot.queryParams['courseId'];
    if (courseId) {
      this.courseId.set(courseId);
      this.examData.courseId = courseId;
    }
  }

  loadInstructorCourses(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found');
      return;
    }

    this.loading.set(true);
    this._courseService.getCoursesByInstructor(user.userId).subscribe({
      next: (result) => {
        // Handle both PagedResult and array responses
        if (Array.isArray(result)) {
          this.courses.set(result);
        } else {
          this.courses.set(result.items || []);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error.set(err.message || 'Failed to load courses');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this._examService.createExam(this.examData).subscribe({
      next: (exam) => {
        this.submitting.set(false);
        this._router.navigate(['/instructor/exams', exam.examId, 'questions']);
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.error.set(err.message || 'Failed to create exam');
        this.submitting.set(false);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.examData.title.trim()) {
      this.error.set('Exam title is required');
      return false;
    }
    if (!this.examData.description.trim()) {
      this.error.set('Exam description is required');
      return false;
    }
    if (!this.examData.courseId) {
      this.error.set('Course ID is required');
      return false;
    }
    if (this.examData.durationMinutes < 1) {
      this.error.set('Duration must be at least 1 minute');
      return false;
    }
    if (this.examData.passingPercentage < 0 || this.examData.passingPercentage > 100) {
      this.error.set('Passing percentage must be between 0 and 100');
      return false;
    }
    return true;
  }

  cancel(): void {
    const courseId = this.courseId();
    if (courseId) {
      this._router.navigate(['/instructor/courses', courseId]);
    } else {
      this._router.navigate(['/instructor/courses']);
    }
  }
}
