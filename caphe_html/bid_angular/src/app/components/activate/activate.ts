import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="min-height:100vh; background:#FAF7F3; display:flex; align-items:center; justify-content:center; padding:60px 20px;">
      <div style="max-width:480px; width:100%; background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(44,26,14,0.08); padding:48px 40px; text-align:center;">
        
        <div *ngIf="status === 'loading'">
          <div style="width:64px; height:64px; border:4px solid #EDE5D8; border-top:4px solid #C8572C; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 24px;"></div>
          <h2 style="font-family:'Playfair Display',serif; color:#2C1A0E; font-size:1.5rem; margin-bottom:8px;">Đang xác thực tài khoản...</h2>
          <p style="color:#7A6A5A; font-size:0.9rem;">Vui lòng đợi trong giây lát.</p>
        </div>

        <div *ngIf="status === 'success'">
          <div style="width:72px; height:72px; background:#d4edda; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
            <span style="font-size:2rem;">✅</span>
          </div>
          <h2 style="font-family:'Playfair Display',serif; color:#2C1A0E; font-size:1.5rem; margin-bottom:8px;">Xác thực thành công!</h2>
          <p style="color:#7A6A5A; font-size:0.9rem; margin-bottom:24px;">Tài khoản của bạn đã được kích hoạt. Bạn đang được đăng nhập...</p>
          <div style="width:40px; height:4px; background:#C8572C; border-radius:2px; margin:0 auto; animation:progress 2s ease-in-out;"></div>
        </div>

        <div *ngIf="status === 'error'">
          <div style="width:72px; height:72px; background:#f8d7da; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
            <span style="font-size:2rem;">❌</span>
          </div>
          <h2 style="font-family:'Playfair Display',serif; color:#2C1A0E; font-size:1.5rem; margin-bottom:8px;">Kích hoạt thất bại</h2>
          <p style="color:#e3000f; font-size:0.9rem; margin-bottom:24px;">{{ errorMessage }}</p>
          <a href="/users/register" style="display:inline-block; padding:12px 28px; background:#C8572C; color:#fff; font-weight:700; border-radius:8px; text-decoration:none; font-size:0.9rem;">Đăng ký lại</a>
        </div>

      </div>
    </section>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes progress { from { width:0; } to { width:100%; } }
    </style>
  `
})
export class Activate implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private site: SiteService
  ) {}

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.status = 'error';
      this.errorMessage = 'Mã kích hoạt không hợp lệ.';
      return;
    }

    try {
      const result: any = await this.site.activateAccount(token);
      if (result.success) {
        this.status = 'success';
        // Lưu thông tin đăng nhập
        sessionStorage.setItem('user', JSON.stringify(result.data.user));
        sessionStorage.setItem('token', result.data.token);
        // Chờ 2 giây rồi chuyển về trang chủ
        setTimeout(() => {
          this.router.navigate(['/']).then(() => window.location.reload());
        }, 2000);
      } else {
        this.status = 'error';
        this.errorMessage = result.message || 'Kích hoạt thất bại.';
      }
    } catch (err: any) {
      this.status = 'error';
      this.errorMessage = err.error?.message || 'Có lỗi xảy ra trong quá trình kích hoạt.';
    }
  }
}
