import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-voucher-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './voucher-form.html',
})
export class AdminVoucherForm implements OnInit {
  isEditMode: boolean = false;
  voucherId: number = 0;
  isSubmitting: boolean = false;

  voucher: any = {
    name: '',
    code: '',
    discount_value: 0,
    discount_type: 'phan_tram',
    min_order_value: 0,
    max_discount_value: null,
    quantity: 1,
    end_date: '',
    description: '',
    status: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.voucherId = parseInt(idParam);
      await this.loadVoucherDetail();
    } else {
      // Set default end_date to 1 week from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      // Format as YYYY-MM-DDTHH:mm
      this.voucher.end_date = defaultDate.toISOString().slice(0, 16);
    }
  }

  async loadVoucherDetail() {
    try {
      const res = await this.adminService.getVoucherById(this.voucherId);
      if (res && res.success && res.data) {
        this.voucher = res.data;
        // Format ISO Date to YYYY-MM-DDTHH:mm for datetime-local input
        if (this.voucher.end_date) {
          const date = new Date(this.voucher.end_date);
          const tzOffset = date.getTimezoneOffset() * 60000;
          const localISODate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
          this.voucher.end_date = localISODate;
        }
      }
    } catch (error) {
      console.error('Error loading voucher detail:', error);
      alert('Không thể tải thông tin chi tiết mã giảm giá');
      this.router.navigate(['/admin/vouchers']);
    }
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    try {
      let res: any;
      if (this.isEditMode) {
        res = await this.adminService.updateVoucher(this.voucherId, this.voucher);
      } else {
        res = await this.adminService.createVoucher(this.voucher);
      }

      if (res && res.success) {
        alert(this.isEditMode ? 'Cập nhật voucher thành công' : 'Thêm voucher thành công');
        this.router.navigate(['/admin/vouchers']);
      }
    } catch (error: any) {
      console.error('Error saving voucher:', error);
      alert(error.error?.message || 'Có lỗi xảy ra khi lưu mã giảm giá');
    } finally {
      this.isSubmitting = false;
    }
  }
}
