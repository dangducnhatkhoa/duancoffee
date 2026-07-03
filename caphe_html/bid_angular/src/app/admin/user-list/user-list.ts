import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-user-list',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class AdminUserList implements OnInit {
  users = signal<any[]>([]);
  search = '';
  loading = signal(true);
  filterType = signal<'all' | 'user' | 'admin'>('all');

  constructor(private adminService: AdminService) {}

  get userAccountCount(): number {
    return this.users().filter((u) => u.user_type !== 'admin').length;
  }

  get adminAccountCount(): number {
    return this.users().filter((u) => u.user_type === 'admin').length;
  }

  get filteredUsers(): any[] {
    const allUsers = this.users();
    if (this.filterType() === 'user') {
      return allUsers.filter((u) => u.user_type !== 'admin');
    } else if (this.filterType() === 'admin') {
      return allUsers.filter((u) => u.user_type === 'admin');
    }
    return allUsers;
  }

  setFilter(type: 'all' | 'user' | 'admin') {
    this.filterType.set(type);
  }

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
