import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-momo-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './momo-payment.html',
})
export class MomoPaymentComponent implements OnInit, OnDestroy {
  orderNumber: string = '';
  totalAmount: number = 0;
  
  // Countdown timer variables
  minutes: number = 5;
  seconds: number = 0;
  private timer: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Lấy thông tin đơn hàng từ sessionStorage
    const orderStr = sessionStorage.getItem('last_order');
    if (!orderStr) {
      this.router.navigate(['/']);
      return;
    }

    const orderData = JSON.parse(orderStr);
    this.orderNumber = orderData.order_number || '';
    this.totalAmount = orderData.total_amount || 0;

    // Start 5-minute countdown
    this.startCountdown();
  }

  startCountdown() {
    let totalSeconds = this.minutes * 60 + this.seconds;
    
    this.timer = setInterval(() => {
      totalSeconds--;
      
      if (totalSeconds < 0) {
        clearInterval(this.timer);
        this.goBack();
        return;
      }
      
      this.minutes = Math.floor(totalSeconds / 60);
      this.seconds = totalSeconds % 60;
      
      // Force change detection
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goBack() {
    // Khi quay về, chuyển sang trang thành công (vì đơn đã tạo ở backend)
    this.router.navigate(['/order-success']);
  }

  getDynamicQR(): string {
    // Sử dụng chuẩn VietQR cho MoMo
    const bankId = '971025'; // BIN MoMo
    const accountNo = 'PSP2612815500000294'; // Số tài khoản VietQR của MoMo
    const accountName = encodeURIComponent('HOANG VAN HOANG ANH');
    const amount = this.totalAmount;
    const addInfo = encodeURIComponent(this.orderNumber);
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  }
}
