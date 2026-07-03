const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Category = db.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, field: 'ten_danh_muc' },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING(255), allowNull: true, field: 'hinh_anh' },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0, field: 'thu_tu' },
  status: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'an_hien' },
  // virtual fields to prevent crash if queried
  created_at: { type: DataTypes.VIRTUAL },
  updated_at: { type: DataTypes.VIRTUAL },
  deleted_at: { type: DataTypes.VIRTUAL }
},
{
  tableName: 'danh_muc', 
  timestamps: false
});

module.exports = Category;
