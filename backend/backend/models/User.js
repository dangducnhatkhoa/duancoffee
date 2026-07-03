const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  username: { type: DataTypes.STRING(255), allowNull: false, unique: true, field: 'ten_dang_nhap' },
  // Map password_hash to mat_khau
  password_hash: { type: DataTypes.STRING(255), allowNull: false, field: 'mat_khau' },
  full_name: { type: DataTypes.STRING(255), allowNull: false, field: 'ho_ten' },
  phone: { type: DataTypes.STRING(20), allowNull: true, field: 'so_dien_thoai' },
  
  // ERD has dia_chi table, so address is virtual in user
  address: { type: DataTypes.VIRTUAL },
  
  user_type: { type: DataTypes.STRING(50), defaultValue: 'user', field: 'vai_tro' },
  status: { type: DataTypes.STRING(50), defaultValue: 'active', field: 'trang_thai' },
  avatar_url: { type: DataTypes.STRING(255), allowNull: true, field: 'anh_dai_dien' },
  bio: { type: DataTypes.VIRTUAL },
  email_verified: { type: DataTypes.VIRTUAL },
  activation_token: { type: DataTypes.STRING(255), allowNull: true, field: 'ma_kich_hoat' },
  activation_expires: { type: DataTypes.DATE, allowNull: true, field: 'han_token' },
  last_login_at: { type: DataTypes.VIRTUAL },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ngay_tao' },
  updated_at: { type: DataTypes.VIRTUAL },
  deleted_at: { type: DataTypes.VIRTUAL }
}, {
  tableName: 'nguoi_dung', 
  timestamps: false
});
module.exports = User;
