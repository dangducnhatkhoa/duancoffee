const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Brand = db.define('Brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, unique: true, field: 'ten_thuong_hieu' },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  country: { type: DataTypes.STRING(100), allowNull: true, field: 'quoc_gia' },
  logo_url: { type: DataTypes.STRING(255), allowNull: true, field: 'logo' },
  description: { type: DataTypes.TEXT, allowNull: true, field: 'mo_ta' },
  website: { type: DataTypes.VIRTUAL },
  status: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'an_hien' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'ngay_tao' },
  updated_at: { type: DataTypes.VIRTUAL }
}, {
  tableName: 'thuong_hieu', 
  timestamps: false
});

module.exports = Brand;
