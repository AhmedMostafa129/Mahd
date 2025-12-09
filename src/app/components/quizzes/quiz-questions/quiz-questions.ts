import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import {
  ExamQuestionDto,
  CreateExamQuestionDto,
  CreateExamQuestionOptionDto,
  ExamQuestionOptionDto
} from '../../../core/interfaces/exam.interface';

@Component({
  selector: 'app-quiz-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-questions.html',
  styleUrl: './quiz-questions.scss',
})
export class QuizQuestions implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);

  examId = signal<string | null>(null);
  questions = signal<ExamQuestionDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  deleting = signal<string | null>(null);
  showAddForm = signal<boolean>(false);

  // Question form data
  questionForm: CreateExamQuestionDto = {
    questionText: '',
    questionType: 'MCQ',
    mark: 1,
    options: [],
    correctAnswer: ''
  };

  questionTypeOptions = [
    { value: 'MCQ', label: 'Multiple Choice' },
    { value: 'TrueFalse', label: 'True/False' },
    { value: 'Text', label: 'Text Answer' }
  ];

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.examId.set(id);
      this.loadQuestions(id);
    }
  }

  loadQuestions(examId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._examService.getQuestionsByExamId(examId).subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.error.set(err.message || 'Failed to load questions');
        this.loading.set(false);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
    if (this.showAddForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.questionForm = {
      questionText: '',
      questionType: 'MCQ',
      mark: 1,
      options: [],
      correctAnswer: ''
    };
  }

  addOption(): void {
    this.questionForm.options.push({
      optionText: '',
      isCorrect: false
    });
  }

  removeOption(index: number): void {
    this.questionForm.options.splice(index, 1);
  }

  submitQuestion(): void {
    const examId = this.examId();
    if (!examId || !this.validateQuestion()) {
      return;
    }

    this._examService.createQuestion(examId, this.questionForm).subscribe({
      next: () => {
        this.loadQuestions(examId);
        this.showAddForm.set(false);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating question:', err);
        this.error.set(err.message || 'Failed to create question');
      }
    });
  }

  deleteQuestion(questionId: string): void {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    this.deleting.set(questionId);

    this._examService.deleteQuestion(questionId).subscribe({
      next: () => {
        const examId = this.examId();
        if (examId) {
          this.loadQuestions(examId);
        }
        this.deleting.set(null);
      },
      error: (err) => {
        console.error('Error deleting question:', err);
        this.error.set(err.message || 'Failed to delete question');
        this.deleting.set(null);
      }
    });
  }

  private validateQuestion(): boolean {
    if (!this.questionForm.questionText.trim()) {
      this.error.set('Question text is required');
      return false;
    }
    if (this.questionForm.mark <= 0) {
      this.error.set('Mark must be greater than 0');
      return false;
    }
    if (this.questionForm.questionType === 'MCQ' || this.questionForm.questionType === 'TrueFalse') {
      if (this.questionForm.options.length < 2) {
        this.error.set('At least 2 options are required for MCQ or True/False questions');
        return false;
      }
      const hasCorrect = this.questionForm.options.some(opt => opt.isCorrect);
      if (!hasCorrect) {
        this.error.set('At least one option must be marked as correct');
        return false;
      }
    }
    if (this.questionForm.questionType === 'Text' && !this.questionForm.correctAnswer?.trim()) {
      this.error.set('Correct answer is required for Text questions');
      return false;
    }
    return true;
  }

  navigateToExam(): void {
    const examId = this.examId();
    if (examId) {
      this._router.navigate(['/instructor/exams', examId]);
    }
  }
}
