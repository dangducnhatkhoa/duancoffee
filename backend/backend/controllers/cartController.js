const { Product, ProductVariant, ProductImage } = require('../models');
// Lưu giỏ hàng vào session `

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    // Lấy thông tin chi tiết sản phẩm
    const cartItems = await Promise.all(
      cart.map(async (item) => {
        const variant = await ProductVariant.findByPk(item.variant_id, {
          include: [
            {
              model: Product, as: 'product',
              include: [
                {
                  model: ProductImage,  as: 'images',
                  where: { is_primary: true },
                  required: false,
                  limit: 1
                }
              ]
            }
          ]
        });
        
        return { ...item, variant: variant };
      })
    );

    const total = cartItems.reduce((sum, item) => {
      const price = item.variant.variant_price || item.variant.product.fixed_price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.log('Error getting cart:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi lấy giỏ hàng', error: error.message
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { variant_id, quantity = 1 } = req.body;
    // Kiểm tra variant tồn tại
    const variant = await ProductVariant.findByPk(variant_id);
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Không thấy sản phẩm'});
    }
    // Kiểm tra tồn kho
    if (variant.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng vượt quá tồn kho'
      });
    }

    // Lấy giỏ hàng hiện tại
    let cart = req.session.cart || [];

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = cart.findIndex(item => item.variant_id === variant_id);

    if (existingItemIndex > -1) {
      // Cập nhật số lượng
      cart[existingItemIndex].quantity += parseInt(quantity);
      
      // Kiểm tra lại tồn kho
      if (cart[existingItemIndex].quantity > variant.stock_quantity) {
        return res.status(400).json({
          success: false, message: 'Số lượng vượt quá tồn kho'
        });
      }
    } else {
      // Thêm mới
      cart.push({ variant_id: variant_id, quantity: parseInt(quantity) });
    }
    req.session.cart = cart;
    res.json({
      success: true, 
      message: 'Đã thêm vào giỏ hàng',
      data: {
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false, message:'Lỗi khi thêm vào giỏ hàng', error: error.message
    });
  }
};

// Cập nhật số lượng
exports.updateCartItem = async (req, res) => {
  try {
    const { variant_id, quantity } = req.body;
    let cart = req.session.cart || [];
    const itemIndex = cart.findIndex(item => item.variant_id === variant_id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false, message: 'Không thấy sản phẩm trong giỏ hàng'
      });
    }

    // Kiểm tra tồn kho
    const variant = await ProductVariant.findByPk(variant_id);
    if (variant.stock_quantity < quantity) {
      return res.status(400).json({
        success: false, message: 'Số lượng vượt quá tồn kho'
      });
    }
    if (quantity <= 0) { // Xóa khỏi giỏ hàng
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = parseInt(quantity);
    }
    req.session.cart = cart;
    res.json({ success: true, message: 'Đã cập nhật giỏ hàng' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi cập nhật giỏ hàng', error: error.message
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { variant_id } = req.query;
    let cart = req.session.cart || [];
    cart = cart.filter(item => item.variant_id !== parseInt(variant_id));
    req.session.cart = cart;
    res.json({success: true, message: 'Đã xóa khỏi giỏ hàng'});
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi xóa khỏi giỏ hàng', error: error.message
    });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    req.session.cart = [];
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi xóa giỏ hàng', error: error.message
    });
  }
};
