const { Review, Product, User, Order, OrderItem, ProductVariant, db } = require('../models');
const { findUserProductReview } = require('../utils/reviewSchema');
const { Op } = require('sequelize');

// Helper to check if user has purchased the product
async function checkUserHasPurchased(userId, productId) {
  // Find all variants for this product
  const variants = await ProductVariant.findAll({ where: { product_id: productId } });
  if (variants.length === 0) return false;
  
  const variantIds = variants.map(v => v.id);

  // Check if user has a paid or delivered or processing order with any of these variants
  const hasBought = await Order.findOne({
    where: {
      buyer_id: userId,
      status: { [Op.ne]: 'cancelled' }
    },
    include: [{
      model: OrderItem,
      as: 'items',
      where: {
        variant_id: { [Op.in]: variantIds }
      }
    }]
  });

  return !!hasBought;
}

exports.getMyReviewStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);

    const existing = await findUserProductReview(db, userId, productId);
    const hasBought = await checkUserHasPurchased(userId, productId);

    res.json({
      success: true,
      data: { 
        alreadyReviewed: !!existing,
        hasBought: hasBought
      }
    });
  } catch (error) {
    console.error('Error checking review status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra đánh giá',
      error: error.message
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.body.product_id, 10);
    const ratingNum = parseInt(req.body.rating, 10);
    const reviewText = (req.body.review_text || '').trim() || null;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm' });
    }

    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn số sao từ 1 đến 5' });
    }

    const product = await Product.findByPk(productId, { attributes: ['id', 'name'] });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    // Check if the user has purchased the product
    const hasBought = await checkUserHasPurchased(userId, product.id);
    if (!hasBought) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ được đánh giá sản phẩm này sau khi mua hàng.'
      });
    }

    const existing = await findUserProductReview(db, userId, product.id);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá sản phẩm này rồi'
      });
    }

    const review = await Review.create({
      product_id: product.id,
      order_item_id: null,
      reviewer_id: userId,
      rating: ratingNum,
      review_text: reviewText
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'full_name', 'avatar_url'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Đánh giá của bạn đã được gửi thành công',
      data: fullReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi đánh giá',
      error: error.message
    });
  }
};
