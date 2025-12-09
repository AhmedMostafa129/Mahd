import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import { UpdateExamDto, ExamDto } from '../../../core/interfaces/exam.interface';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-exam.html',
  styleUrl: './edit-exam.scss',
})
export class EditExam implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);

  examId = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string | null>(null);

  // Form data
  examData: UpdateExamDto = {
    title: '',
    description: '',
    durationMinutes: 60,
    passingPercentage: 60
  };

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.examId.set(id);
      this.loadExam(id);
    } else {
      this.error.set('Exam ID not found');
    }
  }

  loadExam(id: string): void {
    this.loading.set(true);
    this._examService.getExamById(id).subscribe({
      next: (exam: ExamDto) => {
        this.examData = {
          title: exam.title,
          description: exam.description,
          durationMinutes: exam.durationMinutes,
          passingPercentage: exam.passingPercentage
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error.set(err.message || 'Failed to load exam');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const id = this.examId();
    if (!id) {
      this.error.set('Exam ID not found');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this._examService.updateExam(id, this.examData).subscribe({
      next: (exam) => {
        this.submitting.set(false);
        this._router.navigate(['/instructor/exams']);
      },
      error: (err) => {
        console.error('Error updating exam:', err);
        this.error.set(err.message || 'Failed to update exam');
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
    this._router.navigate(['/instructor/exams']);
  }
}
