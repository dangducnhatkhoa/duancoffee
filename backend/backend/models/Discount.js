const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Discount = db.define('Discount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, field: 'ten' },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'ma_ap' },
  discount_value: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'gia_tri_giam' },
  discount_type: { type: DataTypes.STRING(50), defaultValue: 'phan_tram', field: 'kieu_giam_gia' }, // 'phan_tram' hoặc 'tien'
  min_order_value: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00, field: 'gia_tri_don_toi_thieu' },
  max_discount_value: { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: 'gia_tri_giam_toi_da' },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, field: 'so_luong' },
  end_date: { type: DataTypes.DATE, allowNull: false, field: 'ket_thuc' },
  description: { type: DataTypes.TEXT, allowNull: true, field: 'mo_ta' },
  status: { type: DataTypes.TINYINT(1), defaultValue: 1, field: 'an_hien' }
}, {
  tableName: 'ma_giam_gia', 
  timestamps: false
});

module.exports = Discount;
