import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  user: any = null;
  orders: any[] = [];
  selectedOrder: any = null;
  
  // Cancel order modal variables
  showCancelModal: boolean = false;
  orderIdToCancel: number = 0;
  cancelReason: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public site: SiteService
  ) {}

  async ngOnInit() {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      await this.loadOrderHistory();
    } else {
      this.router.navigate(['/users/login']);
    }
  }

  async loadOrderHistory() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${BASE_API}orders/getOrderHistory?limit=50`, { headers })
      );
      if (res && res.success) {
        this.orders = res.data || [];
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  }

  async viewOrderDetail(orderId: number) {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${BASE_API}orders/getOrderDetail/${orderId}`, { headers })
      );
      if (res && res.success) {
        this.selectedOrder = res.data;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading order detail:', error);
      alert('Không thể tải chi tiết đơn hàng.');
    }
  }

  closeOrderDetail() {
    this.selectedOrder = null;
  }

  openCancelModal(orderId: number) {
    this.orderIdToCancel = orderId;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.orderIdToCancel = 0;
    this.cancelReason = '';
  }

  async submitCancelOrder() {
    if (!this.cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng.');
      return;
    }

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const res: any = await firstValueFrom(
        this.http.post(
          `${BASE_API}orders/cancelOrder/${this.orderIdToCancel}`, 
          { reason: this.cancelReason }, 
          { headers }
        )
      );

      if (res && res.success) {
        alert('Đã hủy đơn hàng thành công.');
        this.closeCancelModal();
        this.closeOrderDetail();
        await this.loadOrderHistory();
      } else {
        alert(res.message || 'Hủy đơn hàng thất bại.');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      alert(error.error?.message || 'Lỗi khi hủy đơn hàng.');
    }
  }

  logout() {
    this.router.navigate(['/users/logout']);
  }

  getOrderStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
      case 'cho_xac_nhan':
        return 'Chờ xác nhận';
      case 'processing':
      case 'dang_xu_ly':
        return 'Đang xử lý';
      case 'shipping':
      case 'dang_giao':
        return 'Đang giao hàng';
      case 'completed':
      case 'hoan_thanh':
        return 'Hoàn thành';
      case 'cancelled':
      case 'da_huy':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'pending':
      case 'cho_xac_nhan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
      case 'dang_xu_ly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping':
      case 'dang_giao':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed':
      case 'hoan_thanh':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
      case 'da_huy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
