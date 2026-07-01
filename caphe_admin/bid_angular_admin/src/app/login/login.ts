import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  data = { email: '', password: '' };
  thatbai = '';
  dangXuLy = false;

  constructor(private router: Router, private auth: AuthService) {}

  async onSubmit() {
    this.thatbai = '';
    this.dangXuLy = true;

    try {
      const result: any = await this.auth.login(this.data);

      if (result.success) {
        sessionStorage.setItem('user', JSON.stringify(result.data.user));
        sessionStorage.setItem('token', result.data.token);
        this.router.navigate(['/dashboard']);
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
