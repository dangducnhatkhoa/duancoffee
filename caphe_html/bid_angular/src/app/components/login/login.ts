import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  data = { 
    email: '', 
    password: '' 
  };
  constructor(
    private router: Router, 
    public site: SiteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    const token = q.get('token');
    const userStr = q.get('user');
    const error = q.get('error');
    const info = q.get('info');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        alert('Xác thực tài khoản và đăng nhập thành công!');
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      } catch (e) {
        console.error('Lỗi tự động đăng nhập:', e);
      }
    } else if (error) {
      alert(error);
      this.router.navigate([], { queryParams: {} });
    } else if (info) {
      alert(info);
      this.router.navigate([], { queryParams: {} });
    }
  }
  
  async onSubmit(form: NgForm) {
      try {
        const result:any = await this.site.login(this.data)
        const success = result.success;
        if (success){
            const message = result.message;
            const data = result.data ;
            const user = data.user;
            const token = data.token;
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('token', token);
            
            const state = history.state;
            const url  = state?.['back'] || '/';
            this.router.navigate([url]).then(() => {
              window.location.reload();
            });
        }
        else alert(result.message);         
      } catch (error: any) {
        console.error('Đăng nhập thất bại', error);
        const errMsg = error.error?.message || 'Lỗi kết nối đến server. Vui lòng thử lại sau.';
        alert(errMsg);
      }
  }
}
