import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-sucess',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-sucess.html',
  styleUrl: './order-sucess.css'
})
export class OrderSucess {
  thoigian: string = '';
  count = 100;
  private timer: any;

  // Thông tin đơn hàng
  orderNumber: string = '';
  orderId: number = 0;
  totalAmount: number = 0;
  paymentMethod: string = '';
  shippingName: string = '';
  shippingPhone: string = '';
  shippingAddress: string = '';
  email: string = '';
  items: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cart: CartService
  ) {}

  async ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    // Nếu là Stripe, kiểm tra session trước khi hiện trang success
    if (sessionId) {
      try {
        const res: any = await this.cart.getStripeSession(sessionId);

        if (res?.success && res?.data?.payment_status === 'paid') {
          this.cart.clearCart();
          this.orderNumber = res.data.order_number || '';
          this.orderId = res.data.order_id || 0;
        } else {
          alert('Thanh toán Stripe chưa hoàn tất.');
          this.router.navigate(['/checkout']);
          return;
        }
      } catch (error) {
        console.error('Kiểm tra Stripe session lỗi:', error);
        alert('Không kiểm tra được trạng thái thanh toán.');
        this.router.navigate(['/checkout']);
        return;
      }
    } else {
      // COD / Bank Transfer: lấy thông tin đơn hàng từ sessionStorage
      const orderStr = sessionStorage.getItem('last_order');
      if (!orderStr) {
        // Không có dữ liệu đơn hàng => redirect về trang chủ
        this.router.navigate(['/']);
        return;
      }
      const orderData = JSON.parse(orderStr);
      this.orderNumber = orderData.order_number || '';
      this.orderId = orderData.order_id || 0;
      this.totalAmount = orderData.total_amount || 0;
      this.paymentMethod = orderData.payment_method || '';
      this.shippingName = orderData.shipping_name || '';
      this.shippingPhone = orderData.shipping_phone || '';
      this.shippingAddress = orderData.shipping_address || '';
      this.email = orderData.email || '';
      this.items = orderData.items || [];

      // Xóa dữ liệu tạm sau khi đã đọc
      sessionStorage.removeItem('last_order');
    }

    this.startCountdown();
    this.hiengio();
  }

  startCountdown() {
    this.timer = setInterval(() => {
      this.count--;
      if (this.count === 0) {
        clearInterval(this.timer);
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  hiengio() {
    const now = new Date();
    this.thoigian = now.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPaymentMethodLabel(): string {
    switch (this.paymentMethod) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)';
      case 'vnpay': return 'Ví điện tử VNPAY';
      case 'momo': return 'Ví điện tử MoMo';
      case 'sepay': return 'Chuyển khoản Ngân hàng (Qua VietQR / SePay)';
      default: return 'Không xác định';
    }
  }

  encodeMoMoQR(): string {
    // MoMo QR format: 2|99|PHONE|NAME|email|0|0|AMOUNT|MESSAGE
    const data = `2|99|0866676374|HOANG VAN HOANG ANH||0|0|${this.totalAmount}|${this.orderNumber}`;
    return encodeURIComponent(data);
  }

  encodeVietQR(): string {
    const bankId = 'MB';
    const accountNo = '0866676374';
    const accountName = encodeURIComponent('HOANG VAN HOANG ANH');
    const description = encodeURIComponent(this.orderNumber);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${this.totalAmount}&addInfo=${description}&accountName=${accountName}`;
  }
}
