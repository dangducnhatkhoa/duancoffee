import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  currentUser: any = null;
  pageTitle = 'Dashboard';
  sidebarCollapsed = false;
  expandedMenus: Record<string, boolean> = {
    products: true,
    orders: false,
  };

  constructor(private router: Router, private auth: AdminAuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.setPageTitle(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.setPageTitle(e.urlAfterRedirects));
  }

  private setPageTitle(url: string) {
    if (url.includes('/product')) this.pageTitle = 'Quản lý sản phẩm';
    else if (url.includes('/category')) this.pageTitle = 'Danh mục sản phẩm';
    else if (url.includes('/orders')) this.pageTitle = 'Quản lý đơn hàng';
    else if (url.includes('/users')) this.pageTitle = 'Quản lý tài khoản';
    else this.pageTitle = 'Dashboard';
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleGroup(key: string) {
    this.expandedMenus[key] = !this.expandedMenus[key];
  }

  getInitials(): string {
    const name = this.currentUser?.full_name || 'Admin';
    return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
