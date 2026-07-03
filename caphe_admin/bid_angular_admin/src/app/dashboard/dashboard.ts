import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats: any = null;
  loading = true;

  constructor(private adminService: AdminService) {}

  async ngOnInit() {
    try {
      const res: any = await this.adminService.getDashboard();
      this.stats = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      cho_xac_nhan: 'Chờ xác nhận', pending: 'Chờ xác nhận',
      dang_xu_ly: 'Đang xử lý', processing: 'Đang xử lý',
      dang_giao: 'Đang giao', shipping: 'Đang giao',
      hoan_thanh: 'Hoàn thành', completed: 'Hoàn thành', da_giao: 'Đã giao',
      da_huy: 'Đã hủy', cancelled: 'Đã hủy',
    };
    return map[status] || status;
  }

  statusClass(status: string): string {
    if (['cho_xac_nhan', 'pending'].includes(status)) return 'bg-yellow-100 text-yellow-800';
    if (['dang_xu_ly', 'processing'].includes(status)) return 'bg-blue-100 text-blue-800';
    if (['dang_giao', 'shipping'].includes(status)) return 'bg-indigo-100 text-indigo-800';
    if (['hoan_thanh', 'completed', 'da_giao'].includes(status)) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  }
}
