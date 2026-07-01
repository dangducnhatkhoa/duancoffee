import { Component, signal, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../../services/site-service';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';

@Component({
  selector: 'app-cart', 
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html', 
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  totalPrice = signal(0);  //tổng tiền giỏ hàng (tạm tính)
  shippingFee = signal(0);
  totalAmount = signal(0); // tổng cộng sau phí ship
  cartItems = signal<any[]>([]); //các dòng dữ liệu sp sẽ hiện trong giỏ hàng

  // Voucher properties
  voucherCode = '';
  appliedVoucher: any = null;
  discountAmount = signal(0);

  constructor(
    public site: SiteService, 
    public cart: CartService,
    private http: HttpClient
  ){}

  async ngOnInit() {
    //lấy thông tin sản phẩm trong giỏ hàng từ server lưu vào cartItems
    this.cartItems.set(await this.cart.loadCart());
    
    // Check if there is an applied voucher in session
    const savedVoucher = sessionStorage.getItem('appliedVoucher');
    if (savedVoucher) {
      try {
        this.appliedVoucher = JSON.parse(savedVoucher);
        this.voucherCode = this.appliedVoucher.code;
      } catch (e) {
        sessionStorage.removeItem('appliedVoucher');
      }
    }

    this.updateTotals();
  }

  updateTotals() {
    const subTotal = this.cart.totalPrice(this.cartItems());
    this.totalPrice.set(subTotal);
    const shipping = (subTotal >= 1500000 || subTotal === 0) ? 0 : 35000;
    this.shippingFee.set(shipping);

    // Recalculate discount
    if (this.appliedVoucher) {
      if (subTotal < Number(this.appliedVoucher.min_order_value)) {
        this.appliedVoucher = null;
        this.discountAmount.set(0);
        sessionStorage.removeItem('appliedVoucher');
        alert('Đơn hàng không còn đủ giá trị tối thiểu để áp dụng mã giảm giá này.');
      } else {
        let discountVal = 0;
        if (this.appliedVoucher.discount_type === 'phan_tram') {
          discountVal = subTotal * (Number(this.appliedVoucher.discount_value) / 100);
          if (this.appliedVoucher.max_discount_value && discountVal > Number(this.appliedVoucher.max_discount_value)) {
            discountVal = Number(this.appliedVoucher.max_discount_value);
          }
        } else {
          discountVal = Number(this.appliedVoucher.discount_value);
        }
        this.discountAmount.set(discountVal);
      }
    } else {
      this.discountAmount.set(0);
    }

    this.totalAmount.set(Math.max(0, subTotal + shipping - this.discountAmount()));
  }

  async applyVoucher() {
    if (!this.voucherCode.trim()) {
      alert('Vui lòng nhập mã giảm giá.');
      return;
    }

    const token = sessionStorage.getItem('token') || '';
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng mã giảm giá.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res: any = await firstValueFrom(
        this.http.post(
          `${BASE_API}orders/checkVoucher`, 
          { code: this.voucherCode, orderAmount: this.totalPrice() },
          { headers }
        )
      );

      if (res && res.success) {
        this.appliedVoucher = res.data;
        sessionStorage.setItem('appliedVoucher', JSON.stringify(res.data));
        this.updateTotals();
        alert('Áp dụng mã giảm giá thành công!');
      }
    } catch (error: any) {
      console.error('Apply voucher error:', error);
      alert(error.error?.message || 'Không thể áp dụng mã giảm giá này.');
      this.appliedVoucher = null;
      this.discountAmount.set(0);
      sessionStorage.removeItem('appliedVoucher');
      this.updateTotals();
    }
  }

  //xóa toàn bộ giỏ hàng
  clearCart(){
    this.cart.clearCart();
    sessionStorage.removeItem('appliedVoucher');
    location.reload();
  }

  // Xóa 1 sản phẩm trong giỏ hàng
  removeItem(variant_id: number) {
    this.cart.removeItem(variant_id);
    // updateTotals will run on reload, but let's make sure it handles recalculation
    location.reload();
  }

  //  Khi click nút + hoặc -
  async changeQuantity(item: any, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return; // không cho nhỏ hơn 1

    this.cart.updateQuantity(item.variant_id, newQty);
    this.cartItems.set( await this.cart.loadCart() );
    this.updateTotals();
  }

  // Khi người dùng nhập trực tiếp số lượng trong input
  async updateQuantity(item: any, event: any) {
    const value = Number(event.target.value);
    if (value < 1 || isNaN(value)) return;

    this.cart.updateQuantity(item.variant_id, value);
    this.cartItems.set(await this.cart.loadCart() );
    this.updateTotals();
  }
}
