import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';

@Component({
  selector: 'app-sepay-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sepay-payment.html',
  styleUrl: './sepay-payment.css'
})
export class SepayPayment implements OnInit, OnDestroy {
  orderNumber: string = '';
  orderId: number = 0;
  totalAmount: number = 0;
  shippingName: string = '';
  shippingPhone: string = '';
  shippingAddress: string = '';
  email: string = '';
  items: any[] = [];
  
  // Countdown timer variables
  minutes: number = 10;
  seconds: number = 0;
  private timer: any;
  private checkPaymentInterval: any;
  
  isPaid: boolean = false;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Lấy thông tin đơn hàng từ sessionStorage
    const orderStr = sessionStorage.getItem('last_order');
    if (!orderStr) {
      this.router.navigate(['/']);
      return;
    }

    const orderData = JSON.parse(orderStr);
    this.orderId = orderData.order_id || 0;
    this.orderNumber = orderData.order_number || '';
    this.totalAmount = orderData.total_amount || 0;
    this.shippingName = orderData.shipping_name || '';
    this.shippingPhone = orderData.shipping_phone || '';
    this.shippingAddress = orderData.shipping_address || '';
    this.email = orderData.email || '';
    this.items = orderData.items || [];

    // Start 10-minute countdown
    this.startCountdown();

    // Start polling payment status from backend every 3 seconds
    this.startPollingPayment();
  }

  startCountdown() {
    let totalSeconds = this.minutes * 60 + this.seconds;
    
    this.timer = setInterval(() => {
      totalSeconds--;
      
      if (totalSeconds < 0) {
        clearInterval(this.timer);
        clearInterval(this.checkPaymentInterval);
        this.goBack();
        return;
      }
      
      this.minutes = Math.floor(totalSeconds / 60);
      this.seconds = totalSeconds % 60;
      
      this.cdr.detectChanges();
    }, 1000);
  }

  startPollingPayment() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.checkPaymentInterval = setInterval(async () => {
      if (this.orderId === 0) return;
      try {
        const res: any = await firstValueFrom(
          this.http.get(`${BASE_API}orders/check-status/${this.orderId}`, { headers })
        );
        
        // Kiểm tra xem đơn hàng đã được cập nhật thanh toán chưa
        // Nếu trường payment_date có giá trị, hoặc status chuyển sang paid / dang_xu_ly
        if (res && res.success && res.data) {
          const order = res.data;
          const isMarkedPaid = order.payment_date || ['paid', 'dang_xu_ly', 'processing'].includes(order.status);
          
          if (isMarkedPaid) {
            clearInterval(this.checkPaymentInterval);
            clearInterval(this.timer);
            this.isPaid = true;
            this.cdr.detectChanges();
            
            // Đợi 2 giây cho khách hàng thấy màn hình thành công rồi chuyển trang
            setTimeout(() => {
              this.goSuccess();
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.checkPaymentInterval) clearInterval(this.checkPaymentInterval);
  }

  goBack() {
    // Hết thời gian chuyển khoản hoặc quay lại
    this.router.navigate(['/cart']);
  }

  goSuccess() {
    // Lưu lại thông tin đơn hàng để trang success hiển thị
    sessionStorage.setItem('last_order', JSON.stringify({
      order_id: this.orderId,
      order_number: this.orderNumber,
      total_amount: this.totalAmount,
      payment_method: 'sepay',
      shipping_name: this.shippingName,
      shipping_phone: this.shippingPhone,
      shipping_address: this.shippingAddress,
      email: this.email,
      items: this.items
    }));
    this.router.navigate(['/order-success']);
  }

  getDynamicQR(): string {
    const bankId = 'ICB'; // VietinBank
    const accountNo = '107883120676'; // Tài khoản thật của bạn đã được giải mã từ QR gốc
    const accountName = encodeURIComponent('DANG DUC NHAT KHOA');
    const amount = this.totalAmount;
    const addInfo = encodeURIComponent('SEVQR ' + this.orderNumber);
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  }
}
