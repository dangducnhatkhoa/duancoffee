import { Component, signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { SiteService } from '../../services/site-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  constructor( 
    public site:SiteService, 
    public cart:CartService, 
    private router:Router
  ){}

  totalPrice = signal(0);  //tổng tiền giỏ hàng (tạm tính)
  shippingFee = signal(0);
  totalAmount = signal(0);
  cartItems = signal<any[]>([]); //các dòng dữ liệu sp sẽ hiện trong giỏ hàng
  token:string ="" ;
  paymentMethod: 'cod' | 'vnpay' | 'momo' | 'sepay' = 'cod';
  isSubmitting = false;

  data = signal( { //thông tin người nhận hàng
    shipping_name:"", 
    shipping_phone:"",
    shipping_address:"",
    buyer_notes:"",
    email:""
  })

  async ngOnInit() {
    //kiểm tra đăng nhập chưa
    this.token = sessionStorage.getItem("token") || '';
    if ( !this.token ) { this.router.navigate(['/users/login']); }
 
    //lấy thông tin user đang login
    const user_str = sessionStorage.getItem("user");
    if (user_str==null)  this.router.navigate(['/users/login']);

    const user = JSON.parse(user_str || '{}');
    this.data.set({ //thông tin người nhận hàng
        shipping_name:user.full_name || "", 
        shipping_phone:user.phone || "",
        shipping_address:user.address || "",
        buyer_notes:"",
        email:user.email || ""
    })

    //lấy thông tin sản phẩm trong giỏ hàng từ server
    this.cartItems.set( await this.cart.loadCart() ) ;
    const subTotal = this.cart.totalPrice(this.cartItems());
    this.totalPrice.set(subTotal);
    
    const shipping = (subTotal >= 1500000 || subTotal === 0) ? 0 : 30000;
    this.shippingFee.set(shipping);
    this.totalAmount.set(subTotal + shipping);
  }

async onSubmit(form: NgForm) {
  if (form.invalid) { 
    //nếu form chưa hợp lệ, đánh dấu tất cả các trường là đã chạm để hiển thị lỗi
    form.control.markAllAsTouched();
    return;
  }
  try {
    this.isSubmitting = true;
    const response = await this.cart.checkout({
      ...this.data(),
      payment_method: this.paymentMethod
    });

    // Kiểm tra kết quả trả về
    if (!response || !response.success) {
      alert(response?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      return;
    }

    // COD / VNPAY / Momo / SePay: tạo đơn xong thì qua trang thành công
    if (this.paymentMethod === 'cod' || this.paymentMethod === 'vnpay' || this.paymentMethod === 'momo' || this.paymentMethod === 'sepay') {
      this.cart.clearCart();
      // Lưu thông tin đơn hàng vào sessionStorage để hiển thị ở trang thành công
      sessionStorage.setItem('last_order', JSON.stringify({
        order_id: response.order_id,
        order_number: response.order_number,
        total_amount: response.total_amount,
        payment_method: this.paymentMethod,
        shipping_name: this.data().shipping_name,
        shipping_phone: this.data().shipping_phone,
        shipping_address: this.data().shipping_address,
        email: this.data().email,
        items: this.cartItems()
      }));
      
      if (this.paymentMethod === 'vnpay') {
        await this.router.navigate(['/vnpay-payment']);
      } else if (this.paymentMethod === 'momo') {
        await this.router.navigate(['/momo-payment']);
      } else {
        await this.router.navigate(['/order-success']);
      }
      return;
    }
  } catch (error) {
    console.error('Thanh toán thất bại', error);
    alert('Có lỗi xảy ra, vui lòng thử lại sau.');
  } finally {
    this.isSubmitting = false;
  }
}


}
