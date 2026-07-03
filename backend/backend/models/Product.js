const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Product = db.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_code: { type: DataTypes.STRING(50), allowNull: true, field: 'ma_san_pham' },
  name: { type: DataTypes.STRING(255), allowNull: false, field: 'ten_san_pham' },
  slug: { type: DataTypes.STRING(255), allowNull: true },
  short_description: { type: DataTypes.STRING(500), allowNull: true, field: 'mo_ta_ngan' },
  description: { type: DataTypes.TEXT, allowNull: true, field: 'mo_ta' },
  category_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_danh_muc' },
  brand_id: { type: DataTypes.INTEGER, allowNull: true, field: 'id_thuong_hieu' },
  image: { type: DataTypes.STRING(255), allowNull: true, field: 'hinh_anh' },
  fixed_price: { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: 'gia_goc' },
  sale_price: { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: 'gia_khuyen_mai' },
  promo_start: { type: DataTypes.DATE, allowNull: true, field: 'km_bat_dau' },
  promo_end: { type: DataTypes.DATE, allowNull: true, field: 'km_ket_thuc' },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0, field: 'luot_xem' },
  status: { type: DataTypes.STRING(50), defaultValue: 'con_hang', field: 'trang_thai' },
  featured: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'an_hien' },

  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deleted_at: { type: DataTypes.DATE, allowNull: true, field: 'ngay_xoa' },
}, {
  tableName: 'san_pham',
  timestamps: false,
  paranoid: false,
});

module.exports = Product;
