const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ProductImage = db.define('ProductImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, field: 'id_san_pham' },
  image_url: { type: DataTypes.STRING(255), allowNull: false, field: 'hinh' },
  alt_text: { type: DataTypes.VIRTUAL },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0, field: 'thu_tu' },
  // is_primary usually determines main image, we map it to true for now or keep virtual
  is_primary: { type: DataTypes.VIRTUAL, get() { return this.getDataValue('display_order') === 0 || this.getDataValue('display_order') === 1; } },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ngay_dang' },
  updated_at: { type: DataTypes.VIRTUAL }
}, {
  tableName: 'hinh_anh', timestamps: false
});

module.exports = ProductImage;
