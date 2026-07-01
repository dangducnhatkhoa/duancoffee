const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminProductController = require('../controllers/adminProductController');
const adminAuth = require('../middleware/adminAuth');
const uploadProduct = require('../middleware/uploadProduct');

router.use(adminAuth);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// Quản lý sản phẩm admin
router.get('/products/stats', adminProductController.stats);
router.get('/products', adminProductController.list);
router.get('/products/:id', adminProductController.detail);
router.post('/products', uploadProduct.array('images', 10), adminProductController.create);
router.put('/products/:id', uploadProduct.array('images', 10), adminProductController.update);
router.patch('/products/:id/stock', adminProductController.updateStock);
router.patch('/products/:id/restore', adminProductController.restore);
router.delete('/products/:id', adminProductController.softDelete);
router.delete('/products/:id/force', adminProductController.forceDelete);
router.delete('/products/:productId/images/:imageId', adminProductController.deleteImage);
router.patch('/products/:productId/images/:imageId/primary', adminProductController.setPrimaryImage);

// Quản lý voucher admin
const voucherController = require('../controllers/voucherController');
router.get('/vouchers', voucherController.getVouchers);
router.get('/vouchers/:id', voucherController.getVoucherById);
router.post('/vouchers', voucherController.createVoucher);
router.put('/vouchers/:id', voucherController.updateVoucher);
router.delete('/vouchers/:id', voucherController.deleteVoucher);

module.exports = router;
