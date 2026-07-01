import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { SiteService } from '../../services/site-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html', styleUrls: ['./register.css']
})
export class Register {
  constructor(private router:Router, public site:SiteService) {}

  data = {
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    address: ''
  };

  async  onSubmit(form: NgForm) {
      try {
        await this.site.register(this.data)
        // thành công → chuyển qua trang cảm ơn
        this.router.navigate(['/thanks'], {
          state: {
            title_message: 'Đăng ký thành công!' , 
            message:'Thông tin đăng ký đã được ghi nhận. Mời bạn kiểm tra email để xác nhận!' 
          }
        });
      } catch (error: any) {
        console.error('Đăng ký thất bại', error);
        const msg = error.error?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
        alert(msg);
      }
  }
  togglePassword(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (!input) return; 
    input.type = (input.type === 'password')? 'text': 'password';
  }
}
