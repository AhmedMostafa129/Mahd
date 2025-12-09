import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';
import { UserRole } from '../interfaces/auth.interface';

export const instructorGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = tokenService.getUser();
  console.log('[InstructorGuard] User:', user);
  console.log('[InstructorGuard] User role:', user?.role, 'type:', typeof user?.role);

  if (user && (
    user.role === UserRole.Instructor ||
    user.role === UserRole.Admin ||
    user.role === 'Instructor' ||
    user.role === 'Admin' ||
    user.role === 1 || // Instructor enum value
    user.role === 0    // Admin enum value
  )) {
    console.log('[InstructorGuard] Access granted');
    return true;
  }

  // Redirect to appropriate dashboard if not instructor or admin
  if (user?.role === UserRole.Student || user?.role === 'Student' || user?.role === 2) {
    console.log('[InstructorGuard] User is student, redirecting to /student');
    router.navigate(['/student']);
  } else {
    console.log('[InstructorGuard] Access denied, redirecting to login');
    router.navigate(['/login']);
  }
  return false;
};
