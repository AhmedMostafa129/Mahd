import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/TokenService/token-service';
import { environment } from '../environments/environment';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        // Clear tokens and redirect to login
        tokenService.clearAll();
        router.navigate(['/login']);
      }

      // Handle 403 Forbidden - show error message
      if (error.status === 403) {
        console.error('Access denied: You do not have permission to access this resource');
        // You can inject MatSnackBar here to show error message
      }

      // Handle 404 Not Found
      if (error.status === 404) {
        console.error('Resource not found');
      }

      // Handle 500 Server Error
      if (error.status >= 500) {
        console.error('Server error:', error.message);
      }

      // Extract error message from response
      let errorMessage = 'An error occurred';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Log error for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error,
        headers: error.headers
      });

      // Log full error details in development
      if (!environment.production) {
        console.error('Full error object:', error);
        console.error('Backend error details:', {
          errorBody: error.error,
          statusText: error.statusText,
          url: error.url,
          status: error.status
        });
      }

      // Return error to be handled by component
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        error: error.error
      }));
    })
  );
};
