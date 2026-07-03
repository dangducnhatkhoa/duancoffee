const { Review, Product, User, db } = require('../models');
const { findUserProductReview } = require('../utils/reviewSchema');

exports.getMyReviewStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);

    const existing = await findUserProductReview(db, userId, productId);

    res.json({
      success: true,
      data: { alreadyReviewed: !!existing }
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
