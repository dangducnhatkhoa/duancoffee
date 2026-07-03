/**
 * Tạo / cập nhật tài khoản admin trong bảng nguoi_dung
 * Chạy: node seed-admin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

const ADMIN = {
  email: 'admin@gmail.com',
  username: 'admin',
  password: 'admin123',
  full_name: 'Quản Trị Viên',
  phone: '0901234567',
  user_type: 'admin',
  status: 'active',
};

async function seedAdmin() {
  try {
    await db.authenticate();
    console.log('Đã kết nối database.');

    const password_hash = await bcrypt.hash(ADMIN.password, 10);

    const [existing] = await db.query(
      'SELECT id FROM nguoi_dung WHERE email = :email OR ten_dang_nhap = :username LIMIT 1',
      { replacements: { email: ADMIN.email, username: ADMIN.username } }
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE nguoi_dung SET
          ho_ten = :full_name,
          so_dien_thoai = :phone,
          mat_khau = :password_hash,
          vai_tro = :user_type,
          trang_thai = :status
        WHERE id = :id`,
        {
          replacements: {
            id: existing[0].id,
            full_name: ADMIN.full_name,
            phone: ADMIN.phone,
            password_hash,
            user_type: ADMIN.user_type,
            status: ADMIN.status,
          },
        }
      );
      console.log('Đã cập nhật tài khoản admin (id:', existing[0].id, ')');
    } else {
      await db.query(
        `INSERT INTO nguoi_dung (vai_tro, ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau, trang_thai)
         VALUES (:user_type, :full_name, :phone, :email, :username, :password_hash, :status)`,
        {
          replacements: {
            user_type: ADMIN.user_type,
            full_name: ADMIN.full_name,
            phone: ADMIN.phone,
            email: ADMIN.email,
            username: ADMIN.username,
            password_hash,
            status: ADMIN.status,
          },
        }
      );
      console.log('Đã tạo tài khoản admin mới.');
    }

    console.log('\n--- Thông tin đăng nhập Admin ---');
    console.log('Email   :', ADMIN.email);
    console.log('Mật khẩu:', ADMIN.password);
    console.log('URL     : http://localhost:4200/admin/login');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  }
}

seedAdmin();
