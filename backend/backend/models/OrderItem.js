const { DataTypes } = require('sequelize');
const db = require('../config/database');

const OrderItem = db.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_don_hang' },
  variant_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_bien_the' },
  bid_id: { type: DataTypes.VIRTUAL },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, field: 'so_luong' },
  unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'don_gia' },
  total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'thanh_tien' },
  sale_type: { type: DataTypes.VIRTUAL },
  created_at: { type: DataTypes.VIRTUAL },
  updated_at: { type: DataTypes.VIRTUAL }
}, {
  tableName: 'chi_tiet_don_hang', 
  timestamps: false
});
module.exports = OrderItem;
