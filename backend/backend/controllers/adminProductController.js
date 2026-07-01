const {
  Product, ProductImage, ProductVariant, Category, Brand, OrderItem, db,
} = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { validateProductPayload } = require('../utils/productValidation');
const {
  normalizeImagePath, getPublicFilePath, sortImages, pickPrimaryImageRaw,
} = require('../utils/imageUrl');

const productIncludes = [
  { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
  { model: Brand, as: 'brand', attributes: ['id', 'name', 'slug'] },
  {
    model: ProductImage,
    as: 'images',
    required: false,
    separate: true,
    order: [['display_order', 'ASC'], ['id', 'ASC']],
  },
  { model: ProductVariant, as: 'variants', required: false },
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function imagePath(file) {
  return `/images/products/${file.filename}`;
}

async function getStock(productId) {
  const variants = await ProductVariant.findAll({ where: { product_id: productId } });
  return variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
}

function enrichProduct(p, stock) {
  const json = p.toJSON ? p.toJSON() : p;
  const price = parseFloat(json.fixed_price) || 0;
  const sale = parseFloat(json.sale_price) || 0;
  json.stock = stock ?? 0;
  json.discount_percent = sale > 0 && price > sale
    ? Math.round(((price - sale) / price) * 100) : 0;
  json.is_promo_active = sale > 0 && (!json.promo_end || new Date(json.promo_end) >= new Date());
  json.images = sortImages(json.images || []).map((img) => ({
    ...img,
    image_url: normalizeImagePath(img.image_url) || img.image_url,
  }));
  json.primary_image = normalizeImagePath(pickPrimaryImageRaw(json));
  return json;
}

async function syncProductPrimaryImage(productId, transaction = null) {
  const images = await ProductImage.findAll({
    where: { product_id: productId },
    order: [['display_order', 'ASC'], ['id', 'ASC']],
    transaction,
  });
  const primary = images[0]?.image_url || null;
  await Product.update({ image: primary }, { where: { id: productId }, transaction });
  return primary;
}

/** GET /admin/products - danh sách + lọc + phân trang */
exports.list = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, search = '', category_id = '',
      brand_id = '', status = '', trash = '0',
    } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where = {};

    if (trash === '1') where.deleted_at = { [Op.ne]: null };
    else where.deleted_at = null;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { product_code: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (status) where.status = status;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: productIncludes,
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    const data = await Promise.all(rows.map(async (p) => {
      const stock = await getStock(p.id);
      return enrichProduct(p, stock);
    }));

    res.json({
      success: true,
      data,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error('Admin product list:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /admin/products/stats */
exports.stats = async (req, res) => {
  try {
    const total = await Product.count({ where: { deleted_at: null } });
    const outOfStock = await db.query(`
      SELECT COUNT(DISTINCT sp.id) AS c FROM san_pham sp
      JOIN bien_the bt ON bt.id_san_pham = sp.id
      WHERE sp.ngay_xoa IS NULL AND bt.so_luong_ton = 0
    `, { type: db.QueryTypes.SELECT });
    const lowStock = await db.query(`
      SELECT COUNT(DISTINCT sp.id) AS c FROM san_pham sp
      JOIN bien_the bt ON bt.id_san_pham = sp.id
      WHERE sp.ngay_xoa IS NULL AND bt.so_luong_ton > 0 AND bt.so_luong_ton <= 10
    `, { type: db.QueryTypes.SELECT });
    const [topSelling] = await db.query(`
      SELECT sp.id, sp.ten_san_pham AS name, COALESCE(SUM(ct.so_luong),0) AS sold
      FROM san_pham sp
      LEFT JOIN bien_the bt ON bt.id_san_pham = sp.id
      LEFT JOIN chi_tiet_don_hang ct ON ct.id_bien_the = bt.id
      WHERE sp.ngay_xoa IS NULL
      GROUP BY sp.id ORDER BY sold DESC LIMIT 5
    `);
    const [highStock] = await db.query(`
      SELECT sp.ten_san_pham AS name, SUM(bt.so_luong_ton) AS stock
      FROM san_pham sp JOIN bien_the bt ON bt.id_san_pham = sp.id
      WHERE sp.ngay_xoa IS NULL
      GROUP BY sp.id ORDER BY stock DESC LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        total,
        outOfStock: outOfStock[0]?.c || 0,
        lowStock: lowStock[0]?.c || 0,
        topSelling,
        highStock,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /admin/products/:id */
exports.detail = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: productIncludes });
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const stock = await getStock(product.id);
    res.json({ success: true, data: enrichProduct(product, stock) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** POST /admin/products */
exports.create = async (req, res) => {
  const t = await db.transaction();
  try {
    const validation = await validateProductPayload(req.body, {
      isUpdate: false,
      existingImageCount: 0,
      newFileCount: req.files?.length || 0,
    });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu sản phẩm không hợp lệ',
        errors: validation.errors,
      });
    }

    const {
      name, product_code, short_description, description,
      fixed_price, sale_price, stock, category_id, brand_id,
      status, featured, promo_start, promo_end,
    } = validation.parsed;

    const slug = slugify(name) + '-' + Date.now();
    const code = product_code || `SP${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      product_code: code,
      name,
      slug,
      short_description: short_description || '',
      description: description || '',
      category_id,
      brand_id: brand_id || null,
      fixed_price,
      sale_price: sale_price || null,
      promo_start: promo_start || null,
      promo_end: promo_end || null,
      status: status || 'con_hang',
      featured,
    }, { transaction: t });

    await ProductVariant.create({
      product_id: product.id,
      strap_color: 'Mặc định',
      stock_quantity: stock || 0,
      variant_price: fixed_price,
      status: 'con_hang',
    }, { transaction: t });

    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        const url = imagePath(req.files[i]);
        await ProductImage.create({
          product_id: product.id,
          image_url: url,
          display_order: i + 1,
        }, { transaction: t });
        if (i === 0) await product.update({ image: url }, { transaction: t });
      }
    }

    await t.commit();
    const full = await Product.findByPk(product.id, { include: productIncludes });
    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', data: enrichProduct(full, stock || 0) });
  } catch (error) {
    await t.rollback();
    console.error('Create product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PUT /admin/products/:id */
exports.update = async (req, res) => {
  const t = await db.transaction();
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const existingImageCount = await ProductImage.count({
      where: { product_id: product.id },
      transaction: t,
    });
    const validation = await validateProductPayload(req.body, {
      isUpdate: true,
      productId: product.id,
      existingImageCount,
      newFileCount: req.files?.length || 0,
    });
    if (!validation.valid) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu sản phẩm không hợp lệ',
        errors: validation.errors,
      });
    }

    const {
      name, product_code, short_description, description,
      fixed_price, sale_price, stock, category_id, brand_id,
      status, featured, promo_start, promo_end,
    } = validation.parsed;

    const updates = {
      name,
      product_code: product_code || product.product_code,
      short_description,
      description,
      fixed_price,
      sale_price: sale_price || null,
      category_id,
      brand_id: brand_id || null,
      status,
      featured,
      promo_start: promo_start || null,
      promo_end: promo_end || null,
      slug: slugify(name) + '-' + product.id,
      updated_at: new Date(),
    };

    await product.update(updates, { transaction: t });

    let variant = await ProductVariant.findOne({ where: { product_id: product.id }, transaction: t });
    if (variant) {
      await variant.update({
        stock_quantity: stock || 0,
        variant_price: fixed_price,
      }, { transaction: t });
    } else {
      await ProductVariant.create({
        product_id: product.id,
        strap_color: 'Mặc định',
        stock_quantity: stock || 0,
        variant_price: fixed_price,
        status: 'con_hang',
      }, { transaction: t });
    }

    if (req.files?.length) {
      const count = await ProductImage.count({ where: { product_id: product.id }, transaction: t });
      for (let i = 0; i < req.files.length; i++) {
        const url = imagePath(req.files[i]);
        await ProductImage.create({
          product_id: product.id,
          image_url: url,
          display_order: count + i + 1,
        }, { transaction: t });
        if (count === 0 && i === 0) {
          await product.update({ image: url }, { transaction: t });
        }
      }
      await syncProductPrimaryImage(product.id, t);
    }

    await t.commit();
    const full = await Product.findByPk(product.id, { include: productIncludes });
    const stockTotal = await getStock(product.id);
    res.json({ success: true, message: 'Cập nhật thành công', data: enrichProduct(full, stockTotal) });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PATCH /admin/products/:id/stock - nhập hàng */
exports.updateStock = async (req, res) => {
  try {
    const { quantity, mode = 'set' } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    let variant = await ProductVariant.findOne({ where: { product_id: product.id } });
    if (!variant) {
      variant = await ProductVariant.create({
        product_id: product.id,
        strap_color: 'Mặc định',
        stock_quantity: 0,
        variant_price: product.fixed_price,
      });
    }

    const q = parseInt(quantity, 10) || 0;
    const newStock = mode === 'add' ? variant.stock_quantity + q : q;
    await variant.update({ stock_quantity: Math.max(0, newStock) });

    res.json({ success: true, message: 'Cập nhật tồn kho thành công', data: { stock: newStock } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** DELETE /admin/products/:id - xóa mềm */
exports.softDelete = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await product.update({ deleted_at: new Date(), status: 'an', featured: false });
    res.json({ success: true, message: 'Đã chuyển vào thùng rác' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PATCH /admin/products/:id/restore */
exports.restore = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await product.update({ deleted_at: null, status: 'con_hang', featured: true });
    res.json({ success: true, message: 'Khôi phục sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** DELETE /admin/products/:id/force - xóa vĩnh viễn */
exports.forceDelete = async (req, res) => {
  const t = await db.transaction();
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const images = await ProductImage.findAll({ where: { product_id: product.id }, transaction: t });
    images.forEach((img) => {
      const fp = getPublicFilePath(img.image_url);
      if (fp && fs.existsSync(fp)) fs.unlinkSync(fp);
    });

    await ProductImage.destroy({ where: { product_id: product.id }, transaction: t });
    await ProductVariant.destroy({ where: { product_id: product.id }, transaction: t });
    await product.destroy({ transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Đã xóa vĩnh viễn' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

/** DELETE /admin/products/:productId/images/:imageId */
exports.deleteImage = async (req, res) => {
  try {
    const image = await ProductImage.findOne({
      where: { id: req.params.imageId, product_id: req.params.productId },
    });
    if (!image) return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });
    const fp = getPublicFilePath(image.image_url);
    if (fp && fs.existsSync(fp)) fs.unlinkSync(fp);
    await image.destroy();
    await syncProductPrimaryImage(req.params.productId);
    res.json({ success: true, message: 'Đã xóa ảnh' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PATCH /admin/products/:productId/images/:imageId/primary */
exports.setPrimaryImage = async (req, res) => {
  try {
    const image = await ProductImage.findOne({
      where: { id: req.params.imageId, product_id: req.params.productId },
    });
    if (!image) return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });

    const allImages = await ProductImage.findAll({
      where: { product_id: req.params.productId },
      order: [['display_order', 'ASC']],
    });
    let order = 2;
    for (const img of allImages) {
      if (img.id === image.id) continue;
      await img.update({ display_order: order++ });
    }
    await image.update({ display_order: 1 });
    await Product.update({ image: image.image_url }, { where: { id: req.params.productId } });

    res.json({ success: true, message: 'Đã đặt ảnh đại diện' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
