import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-order-list',
  imports: [CommonModule, FormsModule, DecimalPipe],
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

  async onStatusChange(orderId: number, status: string) {
    await this.adminService.updateOrderStatus(orderId, status);
    await this.loadOrders();
  }
}
