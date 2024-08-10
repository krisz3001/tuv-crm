import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);

  return authService.getCsrfToken().pipe(
    map((token) => {
      const authenticated = token !== '';

      if (state.url === '/') {
        if (authenticated) {
          console.log(`Authorized, Redirecting..., CSRF token: ${token}`);
          return router.parseUrl('/dashboard');
        }
        return true;
      }

      console.log(`Session ${authenticated ? 'Authorized' : 'Unauthorized'}`);
      return authenticated ? true : router.parseUrl('/');
    }),
  );
};
