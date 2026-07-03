import { Component } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class Resetpassword {
  constructor(
    private site:SiteService, 
    private route:ActivatedRoute,
    private router:Router
  ){}
  data = { 
    token: '', 
    new_password:'', 
    confirm_password:'' 
  };

  ngOnInit() { 
    const q = this.route.snapshot.queryParamMap; //chứa các tham số trong query string 
    this.data.token = q.get('token') || "";
    if (this.data.token==='') {
      this.router.navigate(['/']);
    } 
  }
  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    if (this.data.new_password !== this.data.confirm_password) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      const result:any = await this.site.resetpassword(this.data);
      if (result && result.success) {
          this.router.navigate(['/thanks'], {
            state: { title_message: 'Đặt lại mật khẩu thành công!' , message: result.message }
          });
      } else {
        alert(result?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } catch (error: any) {
      console.error('Thực hiện thất bại', error);
      const msg = error?.error?.message || 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.';
      alert(msg);
    }
  }

}
