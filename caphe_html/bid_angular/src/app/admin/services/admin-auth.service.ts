import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly storageKey = 'admin_token';
  private readonly userKey = 'admin_user';

  constructor(private http: HttpClient) {}

  async login(formData: { email: string; password: string }) {
    return await firstValueFrom(
      this.http.post<any>(`${BASE_API}users/adminlogin`, formData)
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.userKey);
  }

  getCurrentUser(): any {
    const raw = sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }

  saveSession(user: any, token: string): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
    sessionStorage.setItem(this.storageKey, token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
