import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const landingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  let router = inject(Router);
  return authService.user.pipe(
    map((user) => {
      if (user) {
        router.navigate(['/dashboard']);
        return false;
      } else return true;
    }),
  );
};
