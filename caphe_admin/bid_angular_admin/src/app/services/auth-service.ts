import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  /** Đăng nhập admin qua API /users/adminlogin */
  async login(formData: { email: string; password: string }) {
    return await firstValueFrom(
      this.http.post<any>(`${BASE_API}users/adminlogin`, formData)
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
