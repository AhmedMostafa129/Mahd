import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/TokenService/token-service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
