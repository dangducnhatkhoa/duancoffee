import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thanks', imports: [],
  templateUrl: './thanks.html', styleUrl: './thanks.css'
})
export class Thanks {
  message: string | null = null;
  title_message: string="Cảm ơn quý khách!";

  thoigian:string="";
  count = signal(10); // đếm ngược 10 giây
  private timer: any;

  constructor(private router: Router) { 
   const state = history.state;
    this.title_message = state?.['title_message'] || 'Cảm ơn quý khách!';
    this.message = state?.['message'] || 'Cảm ơn quý khách đã tin tưởng chúng tôi !';
  }

  ngOnInit() {
    this.startCountdown();
    this.hiengio();
  }

  startCountdown() {
    this.timer = setInterval(() => {
      this.count.set(this.count() - 1);
      if (this.count() < 0) this.count.set(0);
      if (this.count() === 0) {
        clearInterval(this.timer);
        this.router.navigate(['/']); // Chuyển về trang chủ
      }
    }, 1000); // mỗi giây giảm 1
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
  hiengio(){
    const now = new Date();
    const timeString = now.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    this.thoigian = timeString;
  }
}
