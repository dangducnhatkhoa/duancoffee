const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Contact = db.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ho_ten: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  so_dien_thoai: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  noi_dung: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ngay_gui: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  trang_thai: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  }
}, {
  tableName: 'lien_he',
  timestamps: false
});

module.exports = Contact;
