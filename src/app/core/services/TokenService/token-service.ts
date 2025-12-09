import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Save access token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get access token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save refresh token to localStorage
   */
  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Save user data to localStorage
   */
  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user data from localStorage
   */
  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear all tokens and user data
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Clear all auth data including device ID (for logout)
   */
  clearAll(): void {
    this.clearToken();
    // Note: Device ID is kept for re-login
  }
}
