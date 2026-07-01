const { User, Product, Order, Category, ProductVariant, OrderItem, db } = require('../models');
const { Op } = require('sequelize');

/** Thống kê tổng quan cho Dashboard admin */
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalCategories] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count({ where: { user_type: { [Op.ne]: 'admin' } } }),
      Category.count(),
    ]);

    const completedStatuses = ['hoan_thanh', 'completed', 'da_giao', 'delivered'];
    const totalRevenue = await Order.sum('total_amount', {
      where: { status: { [Op.in]: completedStatuses } },
    }) || 0;

    const latestOrders = await Order.findAll({
      limit: 6,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'buyer', attributes: ['id', 'full_name', 'email'] }],
    });

    const statusRows = await Order.findAll({
      attributes: ['status', [db.fn('COUNT', db.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const statusStats = {};
    statusRows.forEach((row) => {
      statusStats[row.status] = parseInt(row.count, 10);
    });

    const year = new Date().getFullYear();
    const [revenueRows] = await db.query(`
      SELECT MONTH(ngay_tao) AS month, COALESCE(SUM(so_tien_thanh_toan), 0) AS revenue
      FROM don_hang
      WHERE trang_thai_don_hang IN ('hoan_thanh','completed','da_giao','delivered')
        AND YEAR(ngay_tao) = :year
      GROUP BY MONTH(ngay_tao)
      ORDER BY month ASC
    `, { replacements: { year } });

    const revenueByMonth = Array(12).fill(0);
    revenueRows.forEach((row) => {
      revenueByMonth[row.month - 1] = parseFloat(row.revenue);
    });

    // Doanh thu 7 ngày gần nhất
    const [revenueByDayRows] = await db.query(`
      SELECT DATE(ngay_tao) AS day, COALESCE(SUM(so_tien_thanh_toan), 0) AS revenue
      FROM don_hang
      WHERE ngay_tao >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND trang_thai_don_hang IN ('hoan_thanh','completed','da_giao','delivered','dang_xu_ly','cho_xac_nhan')
      GROUP BY DATE(ngay_tao)
      ORDER BY day ASC
    `);

    const dayLabels = [];
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = 'T' + (d.getDay() === 0 ? 8 : d.getDay() + 1);
      dayLabels.push(label);
      const found = revenueByDayRows.find((r) => r.day && String(r.day).slice(0, 10) === key);
      revenueByDay.push(found ? parseFloat(found.revenue) : 0);
    }

    // Sản phẩm bán chạy
    const [topProducts] = await db.query(`
      SELECT sp.ten_san_pham AS name, COALESCE(SUM(ct.so_luong), 0) AS sold
      FROM chi_tiet_don_hang ct
      JOIN bien_the bt ON bt.id = ct.id_bien_the
      JOIN san_pham sp ON sp.id = bt.id_san_pham
      GROUP BY sp.id, sp.ten_san_pham
      ORDER BY sold DESC
      LIMIT 5
    `);

    // Danh mục + số sản phẩm
    const [categoriesWithCount] = await db.query(`
      SELECT dm.ten_danh_muc AS name, COUNT(sp.id) AS product_count
      FROM danh_muc dm
      LEFT JOIN san_pham sp ON sp.id_danh_muc = dm.id
      GROUP BY dm.id, dm.ten_danh_muc
      ORDER BY product_count DESC
      LIMIT 5
    `);

    // Tồn kho thấp
    const [lowStockProducts] = await db.query(`
      SELECT sp.ten_san_pham AS name, bt.so_luong_ton AS stock, sp.id
      FROM bien_the bt
      JOIN san_pham sp ON sp.id = bt.id_san_pham
      WHERE bt.so_luong_ton <= 20
      ORDER BY bt.so_luong_ton ASC
      LIMIT 5
    `);

    const [[{ lowStockCount }]] = await db.query(`
      SELECT COUNT(DISTINCT sp.id) AS lowStockCount
      FROM bien_the bt
      JOIN san_pham sp ON sp.id = bt.id_san_pham
      WHERE bt.so_luong_ton <= 20
    `);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        totalRevenue,
        lowStockCount: parseInt(lowStockCount, 10) || 0,
        latestOrders,
        statusStats,
        revenueByMonth,
        revenueByDay,
        dayLabels,
        topProducts,
        categoriesWithCount,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê', error: error.message });
  }
};

/** Danh sách đơn hàng (admin) */
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where = {};

    if (search) {
      where[Op.or] = [
        { order_number: { [Op.like]: `%${search}%` } },
        { shipping_name: { [Op.like]: `%${search}%` } },
        { shipping_phone: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'buyer', attributes: ['id', 'full_name', 'email', 'phone'] }],
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy đơn hàng', error: error.message });
  }
};

/** Cập nhật trạng thái đơn hàng */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['cho_xac_nhan', 'dang_xu_ly', 'dang_giao', 'hoan_thanh', 'da_huy', 'pending', 'processing', 'shipping', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    await order.update({ status, updated_at: new Date() });
    res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: order });
  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật đơn hàng', error: error.message });
  }
};

/** Danh sách người dùng */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where = {};

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash', 'activation_token'] },
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy người dùng', error: error.message });
  }
};

/** Khóa / mở khóa tài khoản */
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    if (user.user_type === 'admin') {
      return res.status(403).json({ success: false, message: 'Không thể thay đổi tài khoản admin' });
    }

    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    await user.update({ status: newStatus });
    res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: user });
  } catch (error) {
    console.error('Admin toggle user error:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật người dùng', error: error.message });
  }
};
