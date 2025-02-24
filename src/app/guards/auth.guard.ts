import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  if (localStorageService.getVariable('token')) {
    return true;
  } 
  else {
    router.navigate(['/login'], {
      queryParams: { tokenExpired: true },
    });
    return false;
  }
};
