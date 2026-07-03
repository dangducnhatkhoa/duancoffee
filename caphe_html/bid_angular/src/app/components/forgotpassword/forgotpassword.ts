import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgotpassword.html',
  styles: ``,
})
export class Forgotpassword {
  data = { 
    email: '' 
  };
  constructor(private router:Router, public site:SiteService) {}

  async  onSubmit(form: NgForm) {
      try {
        const result:any = await this.site.forgotpassword(this.data)
        /* {"success": true,
            "message": "Đã gửi hướng dẫn đặt lại mật khẩu qua email",
          }
        */
        const success = result.success;
        if (success){
            const message = result.message;
            this.router.navigate(['/thanks'], {
              state: { title_message: 'Thông báo!' , message: message }
            });
        }
        else alert("Có lỗi gì đó: " + result.message);
      } catch (error) {
        console.error('Thực hiện thất bại', error);
      }
  }

}
