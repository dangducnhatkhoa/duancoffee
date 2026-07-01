import { HttpInterceptorFn } from '@angular/common/http';

/** Tự động gắn JWT token vào mọi request API */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
