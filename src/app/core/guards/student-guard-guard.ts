import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const studentGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  console.log('[StudentGuard] Checking access to:', state.url);
  console.log('[StudentGuard] Is authenticated:', tokenService.isAuthenticated());

  if (!tokenService.isAuthenticated()) {
    console.log('[StudentGuard] Not authenticated, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[StudentGuard] User:', user);
  console.log('[StudentGuard] User role type:', typeof user?.role);
  console.log('[StudentGuard] UserRole.Student:', UserRole.Student);
  console.log('[StudentGuard] UserRole enum:', UserRole);

  if (user && (
    user.role === UserRole.Student ||
    user.role === UserRole.Admin ||
    user.role === 'Student' ||
    user.role === 'Admin' ||
    user.role === 2 || // Student enum value
    user.role === 0    // Admin enum value
  )) {
    console.log('[StudentGuard] Access granted');
    return true;
  }

  // Redirect to appropriate dashboard if not student or admin
  if (user?.role === UserRole.Instructor || user?.role === 'Instructor' || user?.role === 1) {
    console.log('[StudentGuard] User is instructor, redirecting to /instructor');
    router.navigate(['/instructor']);
  } else {
    console.log('[StudentGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
