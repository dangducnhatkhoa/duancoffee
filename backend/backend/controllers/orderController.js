const { Order, OrderItem, ProductVariant, Product, ProductImage, Payment, Discount, db } = require('../models');
const { Op } = require('sequelize');

const Stripe = require('stripe');
const crypto = require('crypto');
const getStripe = () => process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;


// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  const t = await db.transaction();
  console.log("items", req.body.items);
  try {
    const userId = req.user.id;
    const { 
      shipping_name, 
      shipping_phone, 
      shipping_address,
      payment_method,
      buyer_notes,
      items // [{ variant_id, quantity }]
    } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    // Tính tổng tiền
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variant_id, {
        include: [{ model: Product, as: 'product' }],
        transaction: t
      });

      if (!variant) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy sản phẩm ${item.variant_id}`
        });
      }

      if (variant.stock_quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${variant.product.name} không đủ số lượng`
        });
      }
	
      const unit_price = variant.variant_price || variant.product.fixed_price;
      const total_price = unit_price * item.quantity;
      total_amount += parseFloat(total_price);

      orderItems.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: unit_price,
        total_price: total_price,
        sale_type: 'fixed_price'
      });

      // Giảm tồn kho
      await variant.decrement('stock_quantity', { 
        by: item.quantity,
        transaction: t 
      });
    }

    // Tính phí vận chuyển (giả sử cố định)
    const shipping_fee = 30000;
    total_amount += shipping_fee;

    // Tạo mã đơn hàng
    const order_number = `DH${Date.now()}`;

    // Tạo đơn hàng
    const order = await Order.create({
      order_number,
      buyer_id: userId,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_fee,
      total_amount,
      payment_method,
      buyer_notes,
      status: 'pending',
      payment_status: 'unpaid'
    }, { transaction: t });

    // Tạo chi tiết đơn hàng
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        ...item
      }, { transaction: t });
    }

    // Xóa giỏ hàng
    req.session.cart = [];
    await t.commit();
    res.json({
      success: true, message: 'Đặt hàng thành công',
      data: {
        order_id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false, message: 'Lỗi tạo đơn hàng', error: error.message
    });
  }
};

// Lấy lịch sử đơn hàng
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1, status } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = { buyer_id: userId };
    if (status) {  whereClause.status = status; }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem, as: 'items',
          include: [
            {
              model: ProductVariant, as: 'variant',
              include: [
                {
                  model: Product, as: 'product',
                  include: [
                    {
                      model: ProductImage, as: 'images',
                      required: false,
                      limit: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting order history:', error);
    res.status(500).json({
      success: false, message: 'Lỗi lấy lịch sử đơn hàng', error: error.message
    });
  }
};

// Lấy chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: {  id: orderId, buyer_id: userId  },
      include: [
        {
          model: OrderItem,  as: 'items',
          include: [
            {
              model: ProductVariant,  as: 'variant',
              include: [
                { model: Product, as: 'product',
                  include: [ { model: ProductImage, as: 'images'} ]
                }
              ]
            }
          ]
        },
        { model: Payment,  as: 'payments' }
      ]
    });
    if (!order) {
      return res.status(404).json({success: false, message: 'Không thấy đơn hàng'});
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error getting order detail:', error);
    res.status(500).json({
      success: false, message: 'Lỗi lấy chi tiết đơn hàng', error: error.message
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  const t = await db.transaction();
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await Order.findOne({
      where: { id: orderId, buyer_id: userId  },
      include: [ { model: OrderItem, as: 'items' } ],
      transaction: t
    });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Không thấy đơn hàng'});
    }

    // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đơn hàng ở trạng thái này'
      });
    }

    // Hoàn lại tồn kho
    for (const item of order.items) {
      await ProductVariant.increment('stock_quantity', {
        by: item.quantity,
        where: { id: item.variant_id },
        transaction: t
      });
    }

    // Cập nhật trạng thái đơn hàng
    await order.update({
      status: 'cancelled', admin_notes: `Lý do hủy: ${reason || 'Không có'}`
    }, { transaction: t });

    await t.commit();

    res.json({ success: true, message: 'Đã hủy đơn hàng thành công'});
  } catch (error) {
    await t.rollback();
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi hủy đơn hàng', error: error.message
    });
  }
};

exports.checkout_old = async (req, res) => {
  const t = await db.transaction();
  const buyer_id = req.user.id; //user cho middlware chèn vào
  try {
    const {
      shipping_name, shipping_phone, shipping_address, payment_method = 'cod',
      items = []
    } = req.body;

    if (!items.length) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    // Tính tổng tiền từ danh sách variant
    const variantIds = items.map(i => i.variant_id);
    const variants = await ProductVariant.findAll({
      where: { id: variantIds }
    });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) { //lặp qua items trong giỏ hàng đe7 tính tổng tièn
      const variant = variants.find(v => v.id === item.variant_id);
      if (!variant) continue;

      const quantity = item.quantity || 1;
      const unit_price = Number(variant.variant_price || 0);
      const total_price = unit_price * quantity;
      totalAmount += total_price;

      orderItems.push({
        variant_id: variant.id,
        quantity,
        unit_price,
        total_price,
        sale_type: 'fixed_price'
      });
    }

    //  Tạo order
    const order = await Order.create(
      {
        order_number: `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        buyer_id,
        total_amount: totalAmount,
        shipping_fee: 0,
        shipping_name,
        shipping_phone,
        shipping_address,
        payment_method,
        payment_status: 'unpaid',
        status: 'pending'
      },
      { transaction: t }
    );

    //  Lưu order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          ...item,
          order_id: order.id
        },
        { transaction: t }
      );
    }

    await t.commit();

    res.json({
      success: true,
      message: 'Đặt hàng thành công!',
      order_id: order.id,
      order_number: order.order_number,
      total_amount: totalAmount
    });
  } catch (error) {
    await t.rollback();
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message
    });
  }
};

exports.checkout = async (req, res) => {
  const t = await db.transaction();
  try {
    const buyer_id = req.user.id;
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      buyer_notes = '',
      payment_method = 'cod',
      items = [],
      id_ma_giam_gia = null
    } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address) {
      await t.rollback();
      return res.json({ success: false, message: 'Thiếu thông tin nhận hàng' });
    }

    if (!['cod', 'vnpay', 'momo', 'sepay'].includes(payment_method)) {
      await t.rollback();
      return res.json({ success: false, message: 'Phương thức thanh toán không hợp lệ' });
    }

    if (!items.length) {
      await t.rollback();
      return res.json({ success: false, message: 'Giỏ hàng trống' });
    }

    const variantIds = items.map(i => i.variant_id);
    const variants = await ProductVariant.findAll({
      where: { id: variantIds },
      include: [{ model: Product, as: 'product' }],
      transaction: t
    });

    let total_amount = 0;
    const orderItems = [];

    for (const i of items) {
      const variant = variants.find(v => v.id == i.variant_id);
      if (!variant) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      const unit_price=Number(variant.variant_price || variant.product?.fixed_price || 0);
      const quantity = Number(i.quantity || 1);
      const total_price = unit_price * quantity;

      total_amount += total_price;

      orderItems.push({
        variant_id: variant.id,
        quantity,
        unit_price,
        total_price,
        product_name: variant.product?.name || `Variant #${variant.id}`
      });
    }

    // Process shipping fee
    const shipping_fee = (total_amount >= 1500000 || total_amount === 0) ? 0 : 35000;

    // Process discount
    let final_amount = total_amount + shipping_fee;
    let applied_discount_id = null;
    if (id_ma_giam_gia) {
      const discount = await Discount.findByPk(id_ma_giam_gia, { transaction: t });
      if (discount && discount.status === 1 && discount.quantity > 0) {
        let discount_val = 0;
        if (discount.discount_type === 'phan_tram') {
          discount_val = total_amount * (parseFloat(discount.discount_value) / 100);
          if (discount.max_discount_value && discount_val > parseFloat(discount.max_discount_value)) {
            discount_val = parseFloat(discount.max_discount_value);
          }
        } else if (discount.discount_type === 'co_dinh' || discount.discount_type === 'tien') {
          discount_val = parseFloat(discount.discount_value);
        }
        
        final_amount = Math.max(0, total_amount + shipping_fee - discount_val);
        applied_discount_id = discount.id;
        // Giảm số lần sử dụng của voucher
        discount.quantity = Math.max(0, discount.quantity - 1);
        await discount.save({ transaction: t });
      }
    }

    const order = await Order.create({
      order_number: `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      buyer_id,
      total_amount: final_amount,
      shipping_fee: shipping_fee,
      shipping_name,
      shipping_phone,
      shipping_address,
      buyer_notes,
      payment_method,
      payment_status: 'unpaid',
      status: 'pending',
      id_ma_giam_gia: applied_discount_id
    }, { transaction: t });

    await OrderItem.bulkCreate(
      orderItems.map(i => ({
        order_id: order.id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
        sale_type: 'fixed_price'
      })),
      { transaction: t }
    );

    await t.commit();
    return res.json({
      success: true,
      payment_method: payment_method,
      order_id: order.id,
      order_number: order.order_number,
      total_amount: order.total_amount,
      message: 'Đặt hàng thành công'
    });

  } catch (error) {
    await t.rollback();
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi checkout',
      error: error.message
    });
  }
};

exports.getStripeSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({
      where: {
        buyer_id: req.user.id,
        stripe_session_id: sessionId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ success: false, message: 'Stripe chưa được cấu hình' });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Nếu đã thanh toán mà DB chưa cập nhật thì cập nhật luôn tại đây
    if (session.payment_status === 'paid' && order.payment_status !== 'paid') {
      await order.update({
        payment_status: 'paid',
        payment_date: new Date(),
        status: 'paid',
        payment_reference: session.payment_intent || null //payment_intent là id của giao dịch thanh toán trên Stripe, vd pi_3NxyzABC123456
      });
    }

    return res.json({
      success: true,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        payment_status: session.payment_status
      }
    });
  } catch (error) {
    console.error('Get Stripe session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Không lấy được trạng thái Stripe'
    });
  }
};

exports.checkOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { id: orderId, buyer_id: userId },
      attributes: ['id', 'status', 'payment_date']
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không thấy đơn hàng' });
    }
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error checking order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái đơn hàng',
      error: error.message
    });
  }
};

