const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ProductVariant = db.define('ProductVariant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_san_pham' },
  sku: { type: DataTypes.VIRTUAL, get() { return `SKU-${this.getDataValue('id')}`; } },
  strap_color: { type: DataTypes.STRING(100), allowNull: true, field: 'ten_mau' },
  strap_material: { type: DataTypes.VIRTUAL },
  dial_color: { type: DataTypes.VIRTUAL },
  case_size: { type: DataTypes.VIRTUAL },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0, field: 'so_luong_ton' },
  variant_price: { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: 'gia' },
  is_default: { type: DataTypes.VIRTUAL, get() { return true; } },
  created_at: { type: DataTypes.VIRTUAL },
  updated_at: { type: DataTypes.VIRTUAL },
  status: { type: DataTypes.STRING(50), defaultValue: 'con_hang', field: 'trang_thai' }
}, {
  tableName: 'bien_the', timestamps: false
});

module.exports = ProductVariant;
