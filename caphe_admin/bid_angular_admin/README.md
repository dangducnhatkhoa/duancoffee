# Coffee Admin - Angular

Hệ thống quản trị cửa hàng cà phê (Angular + Node.js API).

## Chạy project

### 1. Backend API (bắt buộc)

```bash
cd DATN2026/backend/backend
npm install
npm start
```

API chạy tại: `http://localhost:3000`

### 2. Admin Angular

```bash
cd DATN2026/caphe_admin/bid_angular_admin
npm install
ng serve
```

Truy cập: `http://localhost:4200/login`

## Đăng nhập Admin

API endpoint: `POST /api/users/adminlogin`

Chỉ tài khoản có `vai_tro = 'admin'` mới đăng nhập được.

Tạo tài khoản admin trong MySQL:

```sql
USE duan2026;
-- Mật khẩu: admin123 (đã hash bcrypt)
INSERT INTO nguoi_dung (ho_ten, email, ten_dang_nhap, mat_khau, vai_tro, trang_thai)
VALUES ('Admin Coffee', 'admin@coffee.com', 'admin', '$2y$10$lRbzSOvQNFRABCW.7hO3uOSOI2pGEolyyUmQ.STVWyFpBINOV.7da', 'admin', 'active');
```

## Chức năng

| Route | Mô tả |
|-------|-------|
| `/login` | Đăng nhập admin |
| `/dashboard` | Tổng quan thống kê |
| `/product` | Danh sách sản phẩm |
| `/category` | Quản lý danh mục |
| `/orders` | Quản lý đơn hàng |
| `/users` | Quản lý người dùng |

## Cấu trúc

- `services/auth-service.ts` - Đăng nhập admin
- `services/admin-service.ts` - API admin (dashboard, orders, users)
- `auth-guard.ts` - Bảo vệ route, kiểm tra JWT + role admin
- `auth.interceptor.ts` - Gắn Bearer token tự động
