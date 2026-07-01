import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/** Bảo vệ route admin - yêu cầu token hợp lệ và vai trò admin */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return router.createUrlTree(['/login']);
    }

    if (decoded.user_type !== 'admin') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return router.createUrlTree(['/login']);
  }
};
