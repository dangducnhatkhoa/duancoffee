const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Payment = db.define('Payment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
  order_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  payment_method: {
    type: DataTypes.ENUM('bank_transfer', 'momo', 'zalopay', 'vnpay', 'paypal', 'cod'),
    defaultValue: 'cod'
  },
  payment_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  transaction_id: { type: DataTypes.STRING(255), allowNull: true },
  gateway_response: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_date: { type: DataTypes.DATE, allowNull: true},
  refund_date: {  type: DataTypes.DATE, allowNull: true },
  refund_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'payments', timestamps: false
});

module.exports = Payment;
