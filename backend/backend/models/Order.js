const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Order = db.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_number: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'ma_don' },
  buyer_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_nguoi_dung' },
  shipping_fee: { type: DataTypes.VIRTUAL },
  total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'so_tien_thanh_toan' },
  shipping_name: { type: DataTypes.STRING(255), allowNull: true, field: 'ho_ten_nguoi_nhan' },
  shipping_phone: { type: DataTypes.STRING(20), allowNull: true, field: 'sdt_nguoi_nhan' },
  shipping_address: { type: DataTypes.STRING(255), allowNull: true, field: 'dia_chi_nguoi_nhan' },
  status: { type: DataTypes.STRING(50), defaultValue: 'cho_xac_nhan', field: 'trang_thai_don_hang' },
  confirmed_date: { type: DataTypes.VIRTUAL },
  payment_date: { type: DataTypes.DATE, allowNull: true, field: 'thoi_diem_thanh_toan' },
  shipping_date: { type: DataTypes.VIRTUAL },
  delivery_date: { type: DataTypes.VIRTUAL },
  completed_date: { type: DataTypes.VIRTUAL },
  buyer_notes: { type: DataTypes.TEXT, allowNull: true, field: 'ghi_chu' },
  admin_notes: { type: DataTypes.VIRTUAL },
  shipping_method: { type: DataTypes.VIRTUAL },
  tracking_number: { type: DataTypes.VIRTUAL },
  payment_method: { type: DataTypes.STRING(50), defaultValue: 'COD', field: 'phuong_thuc_thanh_toan' },
  payment_status: { type: DataTypes.VIRTUAL, get() { return this.getDataValue('payment_date') ? 'paid' : 'unpaid'; } },
  payment_reference: { type: DataTypes.VIRTUAL },
  stripe_session_id: { type: DataTypes.VIRTUAL },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ngay_tao' },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ngay_cap_nhat' }
}, {
  tableName: 'don_hang', 
  timestamps: false
});
module.exports = Order;
