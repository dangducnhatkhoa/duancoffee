const { Op } = require('sequelize');
const { Product, Category, Brand } = require('../models');

const ALLOWED_STATUS = ['con_hang', 'ngung_kinh_doanh', 'an'];
const MAX_NAME_LENGTH = 255;
const MAX_CODE_LENGTH = 50;
const MAX_SHORT_DESC_LENGTH = 500;
const MAX_DESC_LENGTH = 10000;
const MAX_PRICE = 999999999;
const MAX_STOCK = 999999;
const MAX_IMAGES = 10;

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function parseOptionalDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function validateProductFields(data, options = {}) {
  const {
    isUpdate = false,
    existingImageCount = 0,
    newFileCount = 0,
  } = options;

  const errors = {};

  const name = String(data.name || '').trim();
  if (!name) {
    errors.name = 'Tên sản phẩm không được để trống.';
  } else if (name.length < 2) {
    errors.name = 'Tên sản phẩm phải có ít nhất 2 ký tự.';
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Tên sản phẩm không được vượt quá ${MAX_NAME_LENGTH} ký tự.`;
  }

  const productCode = String(data.product_code || '').trim();
  if (productCode) {
    if (productCode.length > MAX_CODE_LENGTH) {
      errors.product_code = `Mã sản phẩm không được vượt quá ${MAX_CODE_LENGTH} ký tự.`;
    } else if (!/^[A-Za-z0-9_-]+$/.test(productCode)) {
      errors.product_code = 'Mã sản phẩm chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới.';
    }
  }

  const shortDescription = String(data.short_description || '');
  if (shortDescription.length > MAX_SHORT_DESC_LENGTH) {
    errors.short_description = `Mô tả ngắn không được vượt quá ${MAX_SHORT_DESC_LENGTH} ký tự.`;
  }

  const description = String(data.description || '');
  if (description.length > MAX_DESC_LENGTH) {
    errors.description = `Mô tả chi tiết không được vượt quá ${MAX_DESC_LENGTH} ký tự.`;
  }

  const categoryId = parseInt(data.category_id, 10);
  if (!data.category_id || Number.isNaN(categoryId) || categoryId <= 0) {
    errors.category_id = 'Vui lòng chọn danh mục hợp lệ.';
  }

  if (data.brand_id !== undefined && data.brand_id !== null && String(data.brand_id).trim() !== '') {
    const brandId = parseInt(data.brand_id, 10);
    if (Number.isNaN(brandId) || brandId <= 0) {
      errors.brand_id = 'Thương hiệu không hợp lệ.';
    }
  }

  const fixedPrice = parseNumber(data.fixed_price);
  if (data.fixed_price === undefined || data.fixed_price === null || data.fixed_price === '') {
    errors.fixed_price = 'Giá bán không được để trống.';
  } else if (Number.isNaN(fixedPrice)) {
    errors.fixed_price = 'Giá bán phải là số hợp lệ.';
  } else if (fixedPrice <= 0) {
    errors.fixed_price = 'Giá bán phải lớn hơn 0.';
  } else if (!Number.isInteger(fixedPrice)) {
    errors.fixed_price = 'Giá bán phải là số nguyên (VNĐ).';
  } else if (fixedPrice > MAX_PRICE) {
    errors.fixed_price = `Giá bán không được vượt quá ${MAX_PRICE.toLocaleString('vi-VN')} đ.`;
  }

  const hasSaleInput = data.sale_price !== undefined
    && data.sale_price !== null
    && String(data.sale_price).trim() !== '';
  let salePrice = null;
  if (hasSaleInput) {
    salePrice = parseNumber(data.sale_price);
    if (Number.isNaN(salePrice)) {
      errors.sale_price = 'Giá khuyến mãi phải là số hợp lệ.';
    } else if (salePrice < 0) {
      errors.sale_price = 'Giá khuyến mãi phải lớn hơn hoặc bằng 0.';
    } else if (salePrice >= fixedPrice) {
      errors.sale_price = 'Giá khuyến mãi phải nhỏ hơn giá bán.';
    } else if (!Number.isInteger(salePrice)) {
      errors.sale_price = 'Giá khuyến mãi phải là số nguyên (VNĐ).';
    } else if (salePrice > MAX_PRICE) {
      errors.sale_price = `Giá khuyến mãi không được vượt quá ${MAX_PRICE.toLocaleString('vi-VN')} đ.`;
    } else if (salePrice > 0 && salePrice < 1000) {
      errors.sale_price = 'Giá khuyến mãi phải từ 1.000 đ trở lên hoặc để trống.';
    } else if (salePrice === 0) {
      salePrice = null;
    }
  }

  if (data.stock !== undefined && data.stock !== null && String(data.stock).trim() !== '') {
    const stock = Number(data.stock);
    if (!Number.isFinite(stock) || !Number.isInteger(stock)) {
      errors.stock = 'Số lượng tồn kho phải là số nguyên.';
    } else if (stock < 0) {
      errors.stock = 'Số lượng tồn kho không được nhỏ hơn 0.';
    } else if (stock > MAX_STOCK) {
      errors.stock = `Số lượng tồn kho không được vượt quá ${MAX_STOCK.toLocaleString('vi-VN')}.`;
    }
  }

  if (data.status && !ALLOWED_STATUS.includes(data.status)) {
    errors.status = 'Trạng thái sản phẩm không hợp lệ.';
  }

  const promoStart = parseOptionalDate(data.promo_start);
  const promoEnd = parseOptionalDate(data.promo_end);
  if (data.promo_start && !promoStart) {
    errors.promo_start = 'Thời gian bắt đầu khuyến mãi không hợp lệ.';
  }
  if (data.promo_end && !promoEnd) {
    errors.promo_end = 'Thời gian kết thúc khuyến mãi không hợp lệ.';
  }
  if (promoStart && promoEnd && promoEnd <= promoStart) {
    errors.promo_end = 'Thời gian kết thúc khuyến mãi phải sau thời gian bắt đầu.';
  }
  if ((promoStart && !promoEnd) || (!promoStart && promoEnd)) {
    errors.promo_end = 'Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc khuyến mãi.';
  }
  if (salePrice !== null && salePrice > 0 && (!promoStart || !promoEnd)) {
    errors.promo_start = errors.promo_start || 'Khi có giá khuyến mãi, cần nhập thời gian khuyến mãi.';
    errors.promo_end = errors.promo_end || 'Khi có giá khuyến mãi, cần nhập thời gian khuyến mãi.';
  }

  const totalImages = existingImageCount + newFileCount;
  if (!isUpdate && totalImages === 0) {
    errors.images = 'Vui lòng chọn ít nhất một ảnh sản phẩm.';
  }
  if (isUpdate && totalImages === 0) {
    errors.images = 'Sản phẩm phải có ít nhất một ảnh.';
  }
  if (totalImages > MAX_IMAGES) {
    errors.images = `Tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    parsed: {
      name,
      product_code: productCode || null,
      short_description: shortDescription,
      description,
      category_id: categoryId,
      brand_id: data.brand_id ? parseInt(data.brand_id, 10) : null,
      fixed_price: Number.isNaN(fixedPrice) ? 0 : fixedPrice,
      sale_price: salePrice,
      stock: data.stock !== undefined && data.stock !== null && String(data.stock).trim() !== ''
        ? Number(data.stock) : 0,
      status: data.status || 'con_hang',
      featured: data.featured !== 'false' && data.featured !== false,
      promo_start: promoStart,
      promo_end: promoEnd,
    },
  };
}

async function validateProductReferences(parsed, productId = null) {
  const errors = {};

  const category = await Category.findByPk(parsed.category_id);
  if (!category) {
    errors.category_id = 'Danh mục không tồn tại.';
  }

  if (parsed.brand_id) {
    const brand = await Brand.findByPk(parsed.brand_id);
    if (!brand) {
      errors.brand_id = 'Thương hiệu không tồn tại.';
    }
  }

  if (parsed.product_code) {
    const where = { product_code: parsed.product_code, deleted_at: null };
    if (productId) where.id = { [Op.ne]: productId };
    const existing = await Product.findOne({ where });
    if (existing) {
      errors.product_code = 'Mã sản phẩm đã được sử dụng.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

async function validateProductPayload(data, options = {}) {
  const fieldResult = validateProductFields(data, options);
  if (!fieldResult.valid) {
    return fieldResult;
  }

  const refResult = await validateProductReferences(
    fieldResult.parsed,
    options.productId || null,
  );

  if (!refResult.valid) {
    return {
      valid: false,
      errors: { ...fieldResult.errors, ...refResult.errors },
      parsed: fieldResult.parsed,
    };
  }

  return fieldResult;
}

module.exports = {
  ALLOWED_STATUS,
  MAX_IMAGES,
  validateProductFields,
  validateProductReferences,
  validateProductPayload,
};
