import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';
import {
  ExamDto,
  ExamQuestionDto,
  ExamAnswerDto,
  ExamAttemptDto,
} from '../../../core/interfaces/exam.interface';
import { TokenService } from '../../../core/services/TokenService/token-service';

@Component({
  selector: 'app-quiz-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-start.html',
  styleUrl: './quiz-start.scss',
})
export class QuizStart implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);
  private readonly _tokenService = inject(TokenService);

  // destroy signal to cleanup timer
  private timerInterval: any;

  exam = signal<ExamDto | null>(null);
  questions = signal<ExamQuestionDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);

  // New Signals
  currentQuestionIndex = signal<number>(0);
  timeLeft = signal<number>(0); // in seconds

  // Computed or helper for formatted time
  get formattedTime(): string {
    const totalSeconds = this.timeLeft();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // answers keyed by questionId
  answers = signal<Record<string, ExamAnswerDto>>({});

  ngOnInit(): void {
    const examId = this._route.snapshot.paramMap.get('examId');
    if (!examId) {
      this.error.set('Exam not found.');
      this.loading.set(false);
      return;
    }

    this.loadExam(examId);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private loadExam(examId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._examService.getExamById(examId).subscribe({
      next: (exam) => {
        this.exam.set(exam);

        // Start Timer
        if (exam.durationMinutes) {
          this.timeLeft.set(exam.durationMinutes * 60);
          this.startTimer();
        }

        this._examService.getQuestionsByExamId(examId).subscribe({
          next: (questions) => {
            this.questions.set(questions);
            this.initialiseAnswers(questions);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading questions:', err);
            this.error.set(err.message || 'Failed to load exam questions');
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error.set(err.message || 'Failed to load exam');
        this.loading.set(false);
      },
    });
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const currentTime = this.timeLeft();
      if (currentTime > 0) {
        this.timeLeft.set(currentTime - 1);
      } else {
        this.submitExam(); // Auto submit
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  private initialiseAnswers(questions: ExamQuestionDto[]): void {
    const map: Record<string, ExamAnswerDto> = {};
    questions.forEach((q) => {
      map[q.questionId] = {
        questionId: q.questionId,
        selectedOptionIds: [],
      };
    });
    this.answers.set(map);
  }

  toggleOption(questionId: string, optionId: string): void {
    const question = this.questions().find((q) => q.questionId === questionId);
    if (!question) return;

    const current = { ...this.answers()[questionId] };

    // Check if Single Choice (MCQ or TrueFalse)
    if (question.questionType === 'TrueFalse' || question.questionType === 'MCQ') {
      // Single select: Clear others, set this one
      current.selectedOptionIds = [optionId];
    } else {
      // Multi-select logic (if we had a checkbox-type question)
      // Assuming 'MCQ' is strictly single select based on standard exams, 
      // but usually MCQ can be multi. If your system assumes MCQ is single answer, use above.
      // If we want to support multi-select MCQ, we need a different type or flag.
      // Given the previous code used checkbox style, I'll assume for this upgrade we STRICTLY enforce Single Select for standard MCQs
      // UNLESS the user explicitly wants multi-select. 
      // The Plan said "Use Radio buttons for single-choice MCQs". So I will enforce single select here.

      current.selectedOptionIds = [optionId];
    }

    this.answers.set({
      ...this.answers(),
      [questionId]: current,
    });
  }

  // Navigation Methods
  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions().length) {
      this.currentQuestionIndex.set(index);
    }
  }

  isQuestionAnswered(questionId: string): boolean {
    const ans = this.answers()[questionId];
    if (!ans) return false;
    if (ans.answerText && ans.answerText.trim().length > 0) return true;
    if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) return true;
    return false;
  }

  updateTextAnswer(questionId: string, text: string): void {
    const current = { ...(this.answers()[questionId] || { questionId }) };
    current.answerText = text;

    this.answers.set({
      ...this.answers(),
      [questionId]: current,
    });
  }

  submitExam(): void {
    const exam = this.exam();
    if (!exam) return;

    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found. Please login again.');
      return;
    }

    const answersArray: ExamAnswerDto[] = Object.values(this.answers());

    this.submitting.set(true);
    this.error.set(null);

    this._examService
      .submitExamAttempt(exam.examId, {
        studentId: user.userId,
        examId: exam.examId,
        answers: answersArray,
      })
      .subscribe({
        next: (attempt: ExamAttemptDto) => {
          this.submitting.set(false);
          this._router.navigate(['/student/exams/attempts', attempt.attemptId]);
        },
        error: (err) => {
          console.error('Error submitting exam:', err);
          this.error.set(err.message || 'Failed to submit exam');
          this.submitting.set(false);
        },
      });
  }
}
