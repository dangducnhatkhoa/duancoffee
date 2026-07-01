import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './voucher-list.html',
})
export class VoucherList implements OnInit {
  vouchers: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  totalVouchers: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadVouchers();
  }

  async loadVouchers() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${BASE_API}admin/vouchers?search=${this.searchQuery}&page=${this.page}&limit=${this.limit}`, { headers })
      );
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

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.delete(`${BASE_API}admin/vouchers/${id}`, { headers })
      );
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
