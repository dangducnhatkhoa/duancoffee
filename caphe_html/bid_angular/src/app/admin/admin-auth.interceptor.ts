import { HttpInterceptorFn } from '@angular/common/http';

/** Gắn admin JWT vào request API admin */
export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('admin_token');
  if (token && (req.url.includes('/api/admin') || req.url.includes('/api/users/adminlogin'))) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
