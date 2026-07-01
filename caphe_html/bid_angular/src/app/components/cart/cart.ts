import { Component, signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../../services/site-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart', imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './cart.html', styleUrl: './cart.css'
})
export class Cart {
  totalPrice = signal( 0);  //tổng tiền giỏ hàng (tạm tính)
  shippingFee = signal(0);
  totalAmount = signal(0); // tổng cộng sau phí ship
  cartItems = signal<any[]>([]); //các dòng dữ liệu sp sẽ hiện trong giỏ hàng

  /* [
     {
        "variant_id": 8, "product_id": 4, "sku": "", "variant_price": "", "strap_color": "",
        "strap_material": "", "dial_color": "", "case_size": "", "product_name": "",
        "brand": {"id": 1, "name": "", "slug": ""}, "image_url": "", "quantity": 4
      }
  ]
  */
  constructor( public site:SiteService, public cart:CartService){}
  async ngOnInit() {
   //lấy thông tin sản phẩm trong giỏ hàng từ server lưu vào cartItems
   this.cartItems.set( await this.cart.loadCart());

   this.cartItems.set( await this.cart.loadCart());
   this.updateTotals();
  }

  updateTotals() {
    const subTotal = this.cart.totalPrice(this.cartItems());
    this.totalPrice.set(subTotal);
    const shipping = (subTotal >= 1500000 || subTotal === 0) ? 0 : 35000;
    this.shippingFee.set(shipping);
    this.totalAmount.set(subTotal + shipping);
  }

  //xóa toàn bộ giỏ hàng
  clearCart(){
    this.cart.clearCart();
    location.reload();
  }

  // Xóa 1 sản phẩm trong giỏ hàng
  removeItem(variant_id: number) {
      this.cart.removeItem(variant_id)
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
