import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/** Bảo vệ route /admin/* - yêu cầu token admin hợp lệ */
export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('admin_token');

  if (!token) {
    return router.createUrlTree(['/admin/login']);
  }

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp < Math.floor(Date.now() / 1000) || decoded.user_type !== 'admin') {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      return router.createUrlTree(['/admin/login']);
    }
    return true;
  } catch {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    return router.createUrlTree(['/admin/login']);
  }
};
