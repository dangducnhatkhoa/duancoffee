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
import { AdminVoucherList } from './voucher-list/voucher-list';
import { AdminVoucherForm } from './voucher-form/voucher-form';
import { AdminArticleList } from './article-list/article-list';
import { AdminArticleForm } from './article-form/article-form';

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
      { path: 'vouchers', component: AdminVoucherList, title: 'Mã giảm giá' },
      { path: 'vouchers/add', component: AdminVoucherForm, title: 'Thêm mã giảm giá' },
      { path: 'vouchers/edit/:id', component: AdminVoucherForm, title: 'Sửa mã giảm giá' },
      { path: 'articles', component: AdminArticleList, title: 'Bài viết' },
      { path: 'articles/add', component: AdminArticleForm, title: 'Thêm bài viết' },
      { path: 'articles/edit/:id', component: AdminArticleForm, title: 'Sửa bài viết' },
    ],
  },
];
