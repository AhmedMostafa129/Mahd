import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[AdminGuard] User:', user);
  console.log('[AdminGuard] User role:', user?.role, 'type:', typeof user?.role);

  if (user && (user.role === UserRole.Admin || user.role === 'Admin' || user.role === 0)) {
    console.log('[AdminGuard] Access granted');
    return true;
  }

  // Redirect to appropriate dashboard if not admin
  if (user?.role === UserRole.Student || user?.role === 'Student' || user?.role === 2) {
    console.log('[AdminGuard] User is student, redirecting to /student');
    router.navigate(['/student']);
  } else if (user?.role === UserRole.Instructor || user?.role === 'Instructor' || user?.role === 1) {
    console.log('[AdminGuard] User is instructor, redirecting to /instructor');
    router.navigate(['/instructor']);
  } else {
    console.log('[AdminGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
