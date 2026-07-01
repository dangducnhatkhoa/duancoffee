const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const voucherController = require('../controllers/voucherController');
const authMiddleware = require('../middleware/auth');

// Tạo đơn hàng
router.post('/createOrder', authMiddleware, orderController.createOrder);

// Lấy lịch sử đơn hàng
router.get('/getOrderHistory',authMiddleware, orderController.getOrderHistory);

// Lấy chi tiết 1 đơn hàng
router.get('/getOrderDetail/:orderId', authMiddleware,orderController.getOrderDetail);

// Hủy đơn hàng
router.post('/cancelOrder/:orderId', authMiddleware, orderController.cancelOrder);

//thanh toán
router.post('/checkout' ,authMiddleware, orderController.checkout);
router.get('/stripe-session/:sessionId', authMiddleware, orderController.getStripeSessionStatus);

// Áp dụng voucher
router.post('/checkVoucher', authMiddleware, voucherController.checkVoucher);

module.exports = router;
