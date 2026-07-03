const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// Lấy sản phẩm nổi bật
router.get('/', cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post('/addToCart', cartController.addToCart);

// Cập nhật số lượng 1 sản phẩm trong giỏ hàng
router.post('/updateCartItem', cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.get('/removeFromCart', cartController.removeFromCart);

// Xóa toàn bộ giỏ hàng
router.get('/clearCart', cartController.clearCart);



module.exports = router;
