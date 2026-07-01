const { Discount } = require('../models');
const { Op } = require('sequelize');

// Lấy danh sách voucher
exports.getVouchers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: vouchers } = await Discount.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      data: vouchers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting vouchers:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách voucher', error: error.message });
  }
};

// Chi tiết voucher
exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await Discount.findByPk(req.params.id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    }
    res.json({ success: true, data: voucher });
  } catch (error) {
    console.error('Error getting voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết voucher', error: error.message });
  }
};

// Tạo mới voucher
exports.createVoucher = async (req, res) => {
  try {
    const {
      name,
      code,
      discount_value,
      discount_type,
      min_order_value,
      max_discount_value,
      quantity,
      end_date,
      description,
      status
    } = req.body;

    if (!name || !code || !discount_value || !end_date) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
    }

    // Check code unique
    const existing = await Discount.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá đã tồn tại' });
    }

    const voucher = await Discount.create({
      name,
      code: code.toUpperCase(),
      discount_value,
      discount_type: discount_type || 'phan_tram',
      min_order_value: min_order_value || 0.00,
      max_discount_value: max_discount_value || null,
      quantity: quantity || 1,
      end_date,
      description,
      status: status !== undefined ? status : 1
    });

    res.json({ success: true, message: 'Tạo voucher thành công', data: voucher });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi tạo voucher', error: error.message });
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      discount_value,
      discount_type,
      min_order_value,
      max_discount_value,
      quantity,
      end_date,
      description,
      status
    } = req.body;

    const voucher = await Discount.findByPk(id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    }

    if (code && code.toUpperCase() !== voucher.code) {
      const existing = await Discount.findOne({ where: { code: code.toUpperCase() } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã tồn tại' });
      }
    }

    await voucher.update({
      name: name || voucher.name,
      code: code ? code.toUpperCase() : voucher.code,
      discount_value: discount_value !== undefined ? discount_value : voucher.discount_value,
      discount_type: discount_type || voucher.discount_type,
      min_order_value: min_order_value !== undefined ? min_order_value : voucher.min_order_value,
      max_discount_value: max_discount_value !== undefined ? max_discount_value : voucher.max_discount_value,
      quantity: quantity !== undefined ? quantity : voucher.quantity,
      end_date: end_date || voucher.end_date,
      description: description !== undefined ? description : voucher.description,
      status: status !== undefined ? status : voucher.status
    });

    res.json({ success: true, message: 'Cập nhật voucher thành công', data: voucher });
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật voucher', error: error.message });
  }
};

// Xóa voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Discount.findByPk(id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher' });
    }

    await voucher.destroy();
    res.json({ success: true, message: 'Xóa voucher thành công' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ success: false, message: 'Lỗi xóa voucher', error: error.message });
  }
};
