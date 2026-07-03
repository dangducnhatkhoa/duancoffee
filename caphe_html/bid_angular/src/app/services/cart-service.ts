import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: {  product_id: number , variant_id: number; quantity: number }[] = [];

  // BehaviorSubject giúp header hoặc component khác cập nhật realtime
  cartCount = new BehaviorSubject<number>(0);

  constructor( private http: HttpClient) {
    const saved = localStorage.getItem('cart');
    this.cart = saved ? JSON.parse(saved) : [];
    this.updateCount();
  }

  //lưu biến cart vào localStorage
  private save() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCount();
  }

  // Tính tổng số sản phẩm  và chuyển đến các nơi khác
  private updateCount() {
    const total = this.cart.reduce((sum, i) => {
      return sum + (Number(i.quantity) || 0);
    }, 0);
    this.cartCount.next(total);
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product_id: number, variant_id: number, quantity: number = 1) {
    const item = this.cart.find(x => x.variant_id === variant_id);
    if (item) item.quantity += quantity;
    else this.cart.push({ product_id: product_id, variant_id: variant_id, quantity });
    this.save();
  }

  //gọi api lấy ds sản phẩm trong cart từ server
  //hàm trả về mảng varint [ {} , { } , {} ]
  async loadCart(): Promise<any[]> {
    if (this.cart.length === 0) return [];
    const ids = this.cart.map(x => x.variant_id).join(',');
    try {
      const res:any = await firstValueFrom(
        this.http.get<any[]>(`${BASE_API}products/cart?variant_ids=${ids}`)
      );
      const variants:any[] = res.data as any[];

      //gắn thêm quanlity cho các sản phẩm lấy từ server
      return variants.map( p => {
        const item = this.cart.find(x => x.variant_id === p.variant_id);
        return { ...p, quantity: item?.quantity ?? 1 };
      });
    } catch (err) {
      console.error('Lỗi load cart:', err);
      return [];
    }
  }

  //tính tổng tiền giỏ hàng
  // cartItems = [ {variant_id, variant_price, quantity,...}, {variant_id, variant_price, quantity,...}]
  totalPrice(cartItems:any[]){
    if (cartItems.length===0) return 0;
    let total=0;
    cartItems.forEach(item => total+= item.variant_price*item.quantity)
    return total;
  }  

  // Xóa toàn bộ giỏ
  clearCart() {
    this.cart = [];
    this.save();
  }

  // Xóa 1 sản phẩm trong giỏ hàng
  removeItem(variant_id: number) {
    this.cart = this.cart.filter(x => x.variant_id !== variant_id);
    this.save();
  }

  //cập nhật số lượng
  updateQuantity(variant_id: number, quantity: number) {
    const item = this.cart.find(x => x.variant_id === variant_id);
    if (item) {
      item.quantity = quantity;
      this.save();
    }
  }

  async checkout_old(data: any): Promise<any> {
    //data = {shipping_name, shipping_phone, shipping_address, buyer_notes}
    // Bổ sung danh sách variant + quantity vào form
    const items = this.cart.map(x => ( { variant_id: x.variant_id, quantity: x.quantity} ));

    const payload = { ...data, items };
    /* payload= {
                "shipping_name": "Nguyễn Văn A",
                "shipping_phone": "0901234567",
                "shipping_address": "123 Lê Lợi, Q1, TP.HCM",
                "payment_method": "cod",
                "items": [
                  { "variant_id": 101, "quantity": 2 },
                  { "variant_id": 105, "quantity": 1 }
                ]
              }
    */

    const token = sessionStorage.getItem('token'); 
    const headers = { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'};
    
    //  Gửi form checkout lên server
    return await firstValueFrom( this.http.post(`${BASE_API}orders/checkout`, payload,  { headers}) );
  }

  async checkout(data: any): Promise<any> {
    const items = this.cart.map(x => ({
      variant_id: x.variant_id,
      quantity: x.quantity
    }));
    const payload = { ...data, items };

    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return await firstValueFrom(
      this.http.post(`${BASE_API}orders/checkout`, payload, { headers })
    );
  }

  async getStripeSession(sessionId: string): Promise<any> {
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return await firstValueFrom(
      this.http.get(`${BASE_API}orders/stripe-session/${sessionId}`, { headers })
    );
  }

}// class
