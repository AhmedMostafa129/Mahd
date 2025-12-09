import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements AfterViewInit {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  userId = signal<string>('');
  email = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  resending = signal<boolean>(false);

  verifyForm: FormGroup = this._formBuilder.group({
    code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]],
  });

  private codeDigits: string[] = ['', '', '', '', '', ''];

  ngOnInit(): void {
    // Get userId and email from navigation state (priority) or query params (fallback)
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    const userIdFromState = state?.['userId'];
    const emailFromState = state?.['email'];
    const userIdParam = this._route.snapshot.queryParams['userId'];
    const emailParam = this._route.snapshot.queryParams['email'];

    // Navigation state takes priority over query params
    if (userIdFromState) {
      this.userId.set(userIdFromState);
    } else if (userIdParam) {
      this.userId.set(userIdParam);
    }

    if (emailFromState) {
      this.email.set(emailFromState);
    } else if (emailParam) {
      this.email.set(emailParam);
    }

    // If no userId, redirect to register
    if (!this.userId()) {
      console.warn('No userId provided, redirecting to register');
      this._router.navigate(['/register']);
    }
  }

  ngAfterViewInit(): void {
    // Auto-focus first input
    setTimeout(() => {
      const firstInput = this.codeInputs.first?.nativeElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);
  }

  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow alphanumeric characters (letters and numbers)
    if (value && !/^[a-zA-Z0-9]$/.test(value)) {
      input.value = '';
      return;
    }

    this.codeDigits[index] = value;
    this.updateFormValue();

    // Auto-advance to next input
    if (value && index < 5) {
      const inputs = this.codeInputs.toArray();
      const nextInput = inputs[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Clear error when user starts typing
    if (this.error()) {
      this.error.set(null);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        // Move to previous input if current is empty
        const inputs = this.codeInputs.toArray();
        const prevInput = inputs[index - 1]?.nativeElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      } else {
        // Clear current digit
        this.codeDigits[index] = '';
        this.updateFormValue();
      }
    }

    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      const inputs = this.codeInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData) {
      // Extract only alphanumeric characters
      const digits = pastedData.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);

      if (digits.length === 6) {
        const inputs = this.codeInputs.toArray();

        // Fill all inputs
        digits.split('').forEach((digit, index) => {
          this.codeDigits[index] = digit;
          const input = inputs[index]?.nativeElement;
          if (input) {
            input.value = digit;
          }
        });

        this.updateFormValue();

        // Focus last input
        inputs[5]?.nativeElement.focus();
      }
    }
  }

  private updateFormValue(): void {
    const code = this.codeDigits.join('');
    this.verifyForm.patchValue({ code });
  }

  isCodeComplete(): boolean {
    return this.codeDigits.every(digit => digit !== '') && this.codeDigits.length === 6;
  }

  onSubmit(): void {
    if (!this.userId() || !this.isCodeComplete()) {
      this.error.set('Please enter the complete verification code');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const code = this.codeDigits.join('');

    this._authService.verifyEmail(this.userId(), code).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error verifying email:', err);
        this.error.set(err.error?.message || err.message || 'Invalid verification code. Please try again.');
        this.loading.set(false);

        // Clear inputs on error
        this.clearCodeInputs();
      },
    });
  }

  resendCode(): void {
    if (!this.email()) {
      this.error.set('Email address is required');
      return;
    }

    this.resending.set(true);
    this.error.set(null);

    this._authService.resendVerification(this.email()).subscribe({
      next: () => {
        this.resending.set(false);
        // Show success feedback
        this.error.set(null);

        // You could add a success message here
        alert('Verification code sent successfully! Please check your email.');
      },
      error: (err) => {
        console.error('Error resending code:', err);
        this.error.set(err.error?.message || err.message || 'Failed to resend verification code');
        this.resending.set(false);
      },
    });
  }

  goToLogin(): void {
    this._router.navigate(['/login']);
  }

  private clearCodeInputs(): void {
    this.codeDigits = ['', '', '', '', '', ''];
    const inputs = this.codeInputs.toArray();
    inputs.forEach(input => {
      input.nativeElement.value = '';
    });
    this.updateFormValue();

    // Focus first input
    inputs[0]?.nativeElement.focus();
  }
}

