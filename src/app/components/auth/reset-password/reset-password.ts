import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  email = signal<string>('');
  resetCode = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);

  ngOnInit(): void {
    // Get email from query params if available
    const emailParam = this._route.snapshot.queryParams['email'];
    if (emailParam) {
      this.email.set(emailParam);
    }
  }

  onSubmit(): void {
    if (!this.email() || !this.resetCode() || !this.newPassword() || !this.confirmPassword()) {
      this.error.set('Please fill all fields');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.newPassword().length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this._authService
      .resetPassword({
        email: this.email(),
        resetCode: this.resetCode(),
        newPassword: this.newPassword(),
        confirmPassword: this.confirmPassword(),
      })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.loading.set(false);
          setTimeout(() => {
            this._router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          this.error.set(err.message || 'Failed to reset password');
          this.loading.set(false);
        },
      });
  }

  goToLogin(): void {
    this._router.navigate(['/login']);
  }
}

