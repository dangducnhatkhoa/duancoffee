const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Review = db.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_item_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_chi_tiet_don_hang' },
  reviewer_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_nguoi_dung' },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 }, field: 'sao' },
  review_text: { type: DataTypes.TEXT, allowNull: true, field: 'noi_dung' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'thoi_gian' },
  updated_at: { type: DataTypes.VIRTUAL }
}, {
  tableName: 'danh_gia', 
  timestamps: false
});

module.exports = Review;
