const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

//lấy thông tin sản phẩm trong giỏ hàng
router.get("/cart", productController.getCartProducts);


// Lấy sản phẩm nổi bật
router.get('/featured', productController.getFeaturedProducts);

// Lấy sản phẩm mới
router.get('/new', productController.getNewProducts);
router.get("/cart", productController.getCartProducts);

// Tìm kiếm sản phẩm
router.get('/search', productController.searchProducts);

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryId', productController.getProductsByCategory);


// Lấy sản phẩm đang đấu giá
router.get('/auction', productController.getAuctionProducts);

// Lấy lịch sử đấu giá của sản phẩm
router.get('/:productId/auction-history', productController.getProductAuctionHistory);

// Lấy chi tiết sản phẩm 
router.get('/:id', productController.getProductDetail);

//lấy thông tin sản phẩm trong giỏ hàng

module.exports = router;
