import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/UserService/user-service';
import { TokenService } from '../../../core/services/TokenService/token-service';
import { UserDto, UserUpdateDto } from '../../../core/interfaces/i-user';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class InstructorProfile implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _tokenService = inject(TokenService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  user = signal<UserDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  saving = signal<boolean>(false);

  // Form data - using regular object instead of signal for ngModel
  formData: Partial<UserUpdateDto> = {
    fullName: '',
    email: '',
  };

  // Password change
  currentPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  changingPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this._tokenService.getUser();
    if (!user || !user.userId) {
      this.error.set('User not found');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this._userService.getUserById(user.userId).subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.formData = {
          fullName: userData.fullName || '',
          email: userData.email || '',
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error.set(err.message || 'Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  saveProfile(): void {
    const user = this.user();
    if (!user) return;

    this.saving.set(true);
    this.error.set(null);

    this._userService.updateUser(user.userId, this.formData as UserUpdateDto).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this._tokenService.saveUser(updatedUser);
        alert('Profile updated successfully');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.error.set(err.message || 'Failed to update profile');
        this.saving.set(false);
      },
    });
  }

  changePassword(): void {
    if (!this.currentPassword() || !this.newPassword() || !this.confirmPassword()) {
      this.error.set('Please fill all password fields');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('New passwords do not match');
      return;
    }

    if (this.newPassword().length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    const user = this.user();
    if (!user) return;

    this.changingPassword.set(true);
    this.error.set(null);

    this._authService
      .changePassword({
        currentPassword: this.currentPassword(),
        newPassword: this.newPassword(),
        confirmPassword: this.confirmPassword(),
      })
      .subscribe({
        next: () => {
          alert('Password changed successfully');
          this.currentPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
          this.changingPassword.set(false);
        },
        error: (err) => {
          console.error('Error changing password:', err);
          this.error.set(err.message || 'Failed to change password');
          this.changingPassword.set(false);
        },
      });
  }
}

