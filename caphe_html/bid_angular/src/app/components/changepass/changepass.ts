import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-changepass',
  imports: [CommonModule, FormsModule],
  templateUrl: './changepass.html',
  styleUrl: './changepass.css',
})
export class Changepass {
  data = {
    email:'',
    token:'',
    old_password: '',
    new_password: '',
    confirm_password: '',
    full_name: ''
  };

  constructor(
    private router:Router, 
    public site:SiteService) {}

  ngOnInit() {
    this.data.token = sessionStorage.getItem("token") || '';
    if (!this.data.token) { this.router.navigate(['/users/login']); }
 
    const user_str = sessionStorage.getItem("user");
    if (user_str==null)  this.router.navigate(['/users/login']);

    const user = JSON.parse(user_str || '{}');
    this.data.email =user.email;
    this.data.full_name =user.full_name; 
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    if (this.data.new_password !== this.data.confirm_password) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    try {
      const result: any = await this.site.changepassword(this.data);
      if (result && result.success) {
        this.router.navigate(['/thanks'], {
          state: {
            title_message: 'Đổi mật khẩu thành công!',
            message: 'Mật khẩu của bạn đã được thay đổi thành công!'
          }
        });
      } else {
        alert(result?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } catch (error: any) {
      console.error('Đổi mật khẩu thất bại', error);
      const msg = error?.error?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      alert(msg);
    }
  }

  togglePassword(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (!input) return; 
    input.type = (input.type === 'password')? 'text': 'password';
  }

}
