import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class AdminOrderList implements OnInit {
  orders = signal<any[]>([]);
  page = signal(1);
  totalPages = signal(0);
  search = '';
  statusFilter = '';
  loading = signal(true);

  // Modal properties
  showEditModal = false;
  selectedOrder: any = null;
  newStatus = '';
  isSaving = false;

  statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'cho_xac_nhan', label: 'Chờ xác nhận' },
    { value: 'dang_xu_ly', label: 'Đang xử lý' },
    { value: 'dang_giao', label: 'Đang giao' },
    { value: 'hoan_thanh', label: 'Hoàn thành' },
    { value: 'da_huy', label: 'Đã hủy' },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadOrders(); }

  async loadOrders() {
    this.loading.set(true);
    try {
      const res: any = await this.adminService.getOrders(this.page(), 10, this.search, this.statusFilter);
      this.orders.set(res.data || []);
      this.totalPages.set(res.pagination?.totalPages || 0);
    } finally {
      this.loading.set(false);
    }
  }

  // Get next step label to print inside table
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
        return 'Đang giao';
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

  formatImageUrl(url: string | undefined): string {
    if (!url) return 'https://placehold.co/100x100?text=Coffee';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('/images/')) {
      return `http://localhost:3000${url}`;
    }
    if (url.startsWith('images/')) {
      return `http://localhost:3000/${url}`;
    }
    return `http://localhost:3000/images/products/${url}`;
  }

  async openEditModal(orderId: number) {
    try {
      const res = await this.adminService.getOrderById(orderId);
      if (res && res.success) {
        this.selectedOrder = res.data;
        this.newStatus = this.selectedOrder.status;
        this.showEditModal = true;
      }
    } catch (e) {
      console.error(e);
      alert('Không thể lấy chi tiết đơn hàng.');
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedOrder = null;
    this.newStatus = '';
  }

  getAllowedStatuses(currentStatus: string): { value: string, label: string }[] {
    const allowed: { value: string, label: string }[] = [];
    if (currentStatus === 'cho_xac_nhan' || currentStatus === 'pending') {
      allowed.push({ value: 'cho_xac_nhan', label: 'Chờ xác nhận' });
      allowed.push({ value: 'dang_xu_ly', label: 'Đang xử lý' });
      allowed.push({ value: 'da_huy', label: 'Đã hủy' });
    } else if (currentStatus === 'dang_xu_ly' || currentStatus === 'processing') {
      allowed.push({ value: 'dang_xu_ly', label: 'Đang xử lý' });
      allowed.push({ value: 'dang_giao', label: 'Đang giao' });
      allowed.push({ value: 'da_huy', label: 'Đã hủy' });
    } else if (currentStatus === 'dang_giao' || currentStatus === 'shipping') {
      allowed.push({ value: 'dang_giao', label: 'Đang giao' });
      allowed.push({ value: 'hoan_thanh', label: 'Hoàn thành' });
    } else {
      if (currentStatus === 'hoan_thanh' || currentStatus === 'completed') {
        allowed.push({ value: 'hoan_thanh', label: 'Hoàn thành' });
      } else {
        allowed.push({ value: 'da_huy', label: 'Đã hủy' });
      }
    }
    return allowed;
  }

  async saveStatus() {
    if (this.newStatus === this.selectedOrder.status) {
      this.closeEditModal();
      return;
    }

    this.isSaving = true;
    try {
      const res = await this.adminService.updateOrderStatus(this.selectedOrder.id, this.newStatus);
      if (res && res.success) {
        alert('Cập nhật trạng thái đơn hàng thành công.');
        this.closeEditModal();
        await this.loadOrders();
      }
    } catch (error: any) {
      console.error(error);
      alert(error.error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    } finally {
      this.isSaving = false;
    }
  }

  // Get current active step index for visual stepper
  getStepperStep(status: string): number {
    switch (status) {
      case 'pending':
      case 'cho_xac_nhan':
        return 1;
      case 'processing':
      case 'dang_xu_ly':
        return 2;
      case 'shipping':
      case 'dang_giao':
        return 3;
      case 'completed':
      case 'hoan_thanh':
        return 4;
      default:
        return 0; // cancelled
    }
  }
}
