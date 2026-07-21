import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Category } from './components/category/category';
import { Introduce } from './components/introduce/introduce';
import { Search } from './components/search/search';
import { Thanks } from './components/thanks/thanks';
import { Contact } from './components/contact/contact';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Logout } from './components/logout/logout';
import { Forgotpassword } from './components/forgotpassword/forgotpassword';
import { Resetpassword } from './components/resetpassword/resetpassword';
import { Changepass } from './components/changepass/changepass';
import { ProductDetail } from './components/product-detail/product-detail';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { OrderSucess } from './components/order-sucess/order-sucess';
import { NewsComponent } from './components/news/news';
import { NewsDetailComponent } from './components/news-detail/news-detail';
import { Profile } from './components/profile/profile';
import { Activate } from './components/activate/activate';
import { VnpayPayment } from './components/vnpay-payment/vnpay-payment';
import { MomoPaymentComponent } from './components/momo-payment/momo-payment';
import { SepayPayment } from './components/sepay-payment/sepay-payment';
import { adminRoutes } from './admin/admin.routes';

import { SupportComponent } from './components/support/support';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'category/:id_category', component: Category, title: 'Sản phẩm trong loại' },
    { path: 'introduce', component: Introduce, title: 'Giới thiệu' },
    { path: 'search', component: Search, title: 'Tìm kiếm sản phẩm' },
    { path: 'thanks', component: Thanks, title: 'Cảm ơn' },
    { path: 'contact', component: Contact, title: 'Liên hệ' },
    { path: 'users/register', component: Register, title: 'Đăng ký' },
    { path: 'users/login', component: Login, title: 'Đăng nhập' },
    { path: 'users/logout', component: Logout, title: 'Đăng xuất' },
    { path: 'users/forgotpassword', component: Forgotpassword, title: 'Quên mật khẩu' },
    { path: 'users/resetpassword', component: Resetpassword, title: 'Đặt lại mật khẩu' },
    { path: 'users/changepassword', component: Changepass, title: 'Đổi mật khẩu' },
    { path: 'users/info', component: Profile, title: 'Thông tin tài khoản' },
    { path: 'users/activate/:token', component: Activate, title: 'Kích hoạt tài khoản' },
    { path: 'product/:id', component: ProductDetail, title: 'Chi tiết sản phẩm' },
    { path: 'cart', component: Cart, title: 'Giỏ hàng của bạn' },
    { path: 'checkout', component: Checkout, title: 'Thanh toán giỏ hàng' },
    { path: 'vnpay-payment', component: VnpayPayment, title: 'Cổng thanh toán VNPAY' },
    { path: 'momo-payment', component: MomoPaymentComponent, title: 'Cổng thanh toán MoMo' },
    { path: 'sepay-payment', component: SepayPayment, title: 'Cổng thanh toán SePay (VietQR)' },
    { path: 'order-success', component: OrderSucess, title: 'Thanh toán thành công' },
    { path: 'news', component: NewsComponent, title: 'Tin tức & Cộng đồng' },
    { path: 'news/:id', component: NewsDetailComponent, title: 'Chi tiết tin tức' },
    { path: 'support/:slug', component: SupportComponent, title: 'Trung tâm hỗ trợ' },

    // Khu vực quản trị: http://localhost:4200/admin
    { path: 'admin', children: adminRoutes },
];
