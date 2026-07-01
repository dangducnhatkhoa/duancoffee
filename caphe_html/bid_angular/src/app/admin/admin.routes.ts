import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin-auth.guard';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminLogin } from './login/login';
import { AdminDashboard } from './dashboard/dashboard';
import { AdminCategoryList } from './category-list/category-list';
import { AdminCategoryForm } from './category-form/category-form';
import { AdminProductList } from './product-list/product-list';
import { AdminProductForm } from './product-form/product-form';
import { AdminOrderList } from './order-list/order-list';
import { AdminUserList } from './user-list/user-list';

export const adminRoutes: Routes = [
  { path: 'login', component: AdminLogin, title: 'Đăng nhập Admin' },
  {
    path: '',
    component: AdminLayout,
    canActivateChild: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard, title: 'Dashboard' },
      { path: 'category', component: AdminCategoryList, title: 'Danh mục' },
      { path: 'category/add', component: AdminCategoryForm, title: 'Thêm danh mục' },
      { path: 'category/edit/:id', component: AdminCategoryForm, title: 'Sửa danh mục' },
      { path: 'product', component: AdminProductList, title: 'Sản phẩm' },
      { path: 'product/add', component: AdminProductForm, title: 'Thêm sản phẩm' },
      { path: 'product/edit/:id', component: AdminProductForm, title: 'Sửa sản phẩm' },
      { path: 'orders', component: AdminOrderList, title: 'Đơn hàng' },
      { path: 'users', component: AdminUserList, title: 'Người dùng' },
    ],
  },
];
