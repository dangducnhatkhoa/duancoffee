const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Article = db.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_loai_bai_viet: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tieu_de: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  noi_dung: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hinh: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  luot_xem: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  luot_thich: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  luot_chia_se: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ngay_dang: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  an_hien: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'bai_viet',
  timestamps: false
});

module.exports = Article;
