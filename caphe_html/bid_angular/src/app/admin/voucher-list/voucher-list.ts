import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-voucher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './voucher-list.html',
})
export class AdminVoucherList implements OnInit {
  vouchers: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  totalVouchers: number = 0;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadVouchers();
  }

  async loadVouchers() {
    try {
      const res = await this.adminService.getVouchers(this.page, this.limit, this.searchQuery);
      if (res && res.success) {
        this.vouchers = res.data || [];
        this.totalVouchers = res.pagination?.total || 0;
        this.totalPages = res.pagination?.totalPages || 1;
      }
    } catch (error) {
      console.error('Error loading vouchers:', error);
      alert('Không thể tải danh sách mã giảm giá');
    }
  }

  async deleteVoucher(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      return;
    }

    try {
      const res = await this.adminService.deleteVoucher(id);
      if (res && res.success) {
        alert('Xóa mã giảm giá thành công');
        await this.loadVouchers();
      }
    } catch (error: any) {
      console.error('Error deleting voucher:', error);
      alert(error.error?.message || 'Không thể xóa mã giảm giá');
    }
  }

  search() {
    this.page = 1;
    this.loadVouchers();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadVouchers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadVouchers();
    }
  }
}
