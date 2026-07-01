import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-contact', imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',  styleUrl: './contact.css'
})

export class Contact {
  constructor(private site:SiteService, private router:Router) {}
  
  formData = { 
    fullName:"",
    email:"",
    phone:"",
    message:""
  };

  async onSubmit() {
    try {
      await this.site.sendContact(this.formData);
      
      this.router.navigate(['/thanks'], { // thành công → chuyển qua trang cảm ơn
        state: {
          title_message: 'Cảm ơn bạn đã liên hệ!' , 
          message: 'Chúng tôi đã nhận thông tin và sẽ hồi đáp bạn trong thời gian sớm nhất!' 
        }
      });
    } catch (error) {
      console.error('Gửi liên hệ lỗi:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  }
}
