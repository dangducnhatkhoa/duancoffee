import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  data = { email: '', password: '' };
  thatbai = '';
  dangXuLy = false;

  constructor(private router: Router, private auth: AdminAuthService) {}

  async onSubmit() {
    this.thatbai = '';
    this.dangXuLy = true;
    try {
      const result: any = await this.auth.login(this.data);
      if (result.success) {
        this.auth.saveSession(result.data.user, result.data.token);
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.thatbai = result.message || 'Đăng nhập thất bại';
      }
    } catch {
      this.thatbai = 'Không kết nối được server. Hãy chạy backend trước.';
    } finally {
      this.dangXuLy = false;
    }
  }
}
