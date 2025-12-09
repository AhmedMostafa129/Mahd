// Auth Interfaces based on Backend DTOs

export enum UserRole {
  Admin = 0,
  Instructor = 1,
  Student = 2
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordDto {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActiveDeviceDto {
  deviceId: string;
  deviceInfo?: string;
  lastActiveAt: string;
  isCurrent?: boolean;
}

export interface VerifyEmailDto {
  userId: string;
  code: string;
}

