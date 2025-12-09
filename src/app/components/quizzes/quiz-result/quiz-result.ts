import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/QuizService/quiz-service';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.scss',
})
export class QuizResult implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _examService = inject(ExamService);

  result = signal<any | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const attemptId = this._route.snapshot.paramMap.get('attemptId');
    if (!attemptId) {
      this.error.set('Attempt not found.');
      this.loading.set(false);
      return;
    }

    this.loadResult(attemptId);
  }

  private loadResult(attemptId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this._examService.getAttemptDetail(attemptId).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading exam result:', err);
        this.error.set(err.message || 'Failed to load exam result');
        this.loading.set(false);
      },
    });
  }

  backToDashboard(): void {
    this._router.navigate(['/student']);
  }
}
