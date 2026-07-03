import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users = signal<any[]>([]);
  search = '';
  loading = signal(true);

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadUsers(); }

  async loadUsers() {
    this.loading.set(true);
    try {
      const res: any = await this.adminService.getUsers(1, 50, this.search);
      this.users.set(res.data || []);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleStatus(id: number) {
    if (!confirm('Thay đổi trạng thái tài khoản này?')) return;
    await this.adminService.toggleUserStatus(id);
    await this.loadUsers();
  }

  roleLabel(role: string): string {
    return role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
  }
}
