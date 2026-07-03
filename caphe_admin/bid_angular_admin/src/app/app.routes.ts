import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from './auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { CategoryList } from './category-list/category-list';
import { CategoryForm } from './category-form/category-form';
import { ProductList } from './product-list/product-list';
import { ProductForm } from './product-form/product-form';
import { OrderList } from './order-list/order-list';
import { UserList } from './user-list/user-list';
import { VoucherList } from './voucher-list/voucher-list';
import { VoucherForm } from './voucher-form/voucher-form';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },

      { path: 'category', component: CategoryList, title: 'Danh mục' },
      { path: 'category/add', component: CategoryForm, title: 'Thêm danh mục' },
      { path: 'category/edit/:id', component: CategoryForm, title: 'Sửa danh mục' },

      { path: 'product', component: ProductList, title: 'Sản phẩm' },
      { path: 'product/add', component: ProductForm, title: 'Thêm sản phẩm' },
      { path: 'product/edit/:id', component: ProductForm, title: 'Sửa sản phẩm' },

      { path: 'orders', component: OrderList, title: 'Đơn hàng' },
      { path: 'users', component: UserList, title: 'Người dùng' },
      { path: 'vouchers', component: VoucherList, title: 'Mã giảm giá' },
      { path: 'vouchers/add', component: VoucherForm, title: 'Thêm mã giảm giá' },
      { path: 'vouchers/edit/:id', component: VoucherForm, title: 'Sửa mã giảm giá' },
    ],
  },
];
