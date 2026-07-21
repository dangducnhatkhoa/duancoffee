const { Product, ProductImage, ProductVariant, Category, Brand, Review, User, OrderItem ,Auction, Bid,  db } = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const { limit = 12, page = 1, sort = 'newest', category_id, brand_id } = req.query;
    const offset = (page - 1) * limit;

    // Điều kiện where
    const where = {
      deleted_at: null,
      status: 'con_hang',
    };
    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;

    // Thứ tự sắp xếp
    let order = [];
    switch (sort) {
      case 'newest':     order = [['created_at', 'DESC']]; break;
      case 'price_asc':  order = [['fixed_price', 'ASC']];  break;
      case 'price_desc': order = [['fixed_price', 'DESC']]; break;
      case 'popular':    order = [['view_count', 'DESC']];  break;
      default:           order = [['created_at', 'DESC']];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductImage, as: 'images', required: false, limit: 1 },
        { model: Brand,    as: 'brand',    attributes: ['id', 'name', 'slug'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: ProductVariant, as: 'variants', required: false, limit: 1 }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      distinct: true
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

// Lấy danh sách sản phẩm nổi bật
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { featured: true, deleted_at: null, status: 'con_hang' },
      include: [
        {
          model: ProductImage, 
          as: 'images',
          required: false,
          limit: 1
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,  
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductVariant,
          as: 'variants',
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['view_count', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm nổi bật',
      error: error.message
    });
  }
};
// controllers/productController.js
exports.getCartProducts = async (req, res) => {
  try {

    // 1️. Lấy danh sách variant_ids từ query
    const variantIds = req.query.variant_ids
      ? req.query.variant_ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : [];

    if (variantIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu danh sách variant_ids',});
    }

    // 2. Truy vấn bảng ProductVariant, join sang Product, Brand, Image
    const variants = await ProductVariant.findAll({
      where: { id: variantIds },
      attributes: [
        'id', 'product_id', 'sku', 'strap_color', 'strap_material',
        'dial_color', 'case_size', 'variant_price'
      ],
      include: [
        {
          model: Product, as: 'product', attributes: ['id', 'name', 'slug'],
          include: [
            { model: Brand, as: 'brand', attributes: ['id', 'name', 'slug'] },
            {
              model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'alt_text'],  required: false, limit: 1
            }
          ]
        }
      ]
    });

    // 3 Chuẩn hoá dữ liệu trả về
    const data = variants.map(v => ({
      variant_id: v.id,
      product_id: v.product?.id,
      sku: v.sku,
      variant_price: v.variant_price,
      strap_color: v.strap_color,
      strap_material: v.strap_material,
      dial_color: v.dial_color,
      case_size: v.case_size,
      product_name: v.product?.name,
      brand: v.product?.brand ? {
        id: v.product.brand.id,
        name: v.product.brand.name,
        slug: v.product.brand.slug
      } : null,
      image_url: v.product?.images?.[0]?.image_url || null
    }));

    // 4️ Trả kết quả
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting cart products:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi lấy danh sách sản phẩm trong giỏ hàng',
      error: error.message
    });
  }
};

// Lấy danh sách sản phẩm mới
exports.getNewProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        },
      include: [
        {
          model: ProductImage, as: 'images',
          required: false,
          limit: 1
        },
        {
          model: Brand,  as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,  as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductVariant,  as: 'variants',
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting new products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm mới',
      error: error.message
    });
  }
};

// Lấy chi tiết 1 sản phẩm
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        [Op.or]: [ { id: id }, { slug: id } ] 
      },
      include: [
        {
          model: ProductImage,  as: 'images',  order: [['display_order', 'ASC']]
        },
        {  model: Brand, as: 'brand'  },
        {  model: Category, as: 'category' },
        {  model: ProductVariant, as: 'variants',  order: [['is_default', 'DESC']]  }
      ]
    });

    if (!product) {
      return res.json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    // Tăng lượt xem
    await product.increment('view_count');

    const reviewRows = await db.query(`
      SELECT dg.id, dg.sao AS rating, dg.noi_dung AS review_text, dg.thoi_gian AS created_at,
             dg.id_nguoi_dung AS reviewer_id,
             u.ho_ten AS full_name, u.anh_dai_dien AS avatar_url
      FROM danh_gia dg
      JOIN nguoi_dung u ON dg.id_nguoi_dung = u.id
      LEFT JOIN chi_tiet_don_hang ct ON dg.id_chi_tiet_don_hang = ct.id
      LEFT JOIN bien_the bt ON ct.id_bien_the = bt.id
      WHERE (dg.id_san_pham = :productId OR bt.id_san_pham = :productId)
        AND (dg.an_hien IS NULL OR dg.an_hien = 1)
      ORDER BY dg.thoi_gian DESC
      LIMIT 10
    `, {
      replacements: { productId: product.id },
      type: db.QueryTypes.SELECT
    });

    const reviews = reviewRows.map((row) => ({
      id: row.id,
      rating: row.rating,
      review_text: row.review_text,
      created_at: row.created_at,
      reviewer: {
        id: row.reviewer_id,
        full_name: row.full_name,
        avatar_url: row.avatar_url
      }
    }));

    const [stats] = await db.query(`
      SELECT AVG(dg.sao) AS avgRating, COUNT(dg.id) AS totalReviews
      FROM danh_gia dg
      LEFT JOIN chi_tiet_don_hang ct ON dg.id_chi_tiet_don_hang = ct.id
      LEFT JOIN bien_the bt ON ct.id_bien_the = bt.id
      WHERE (dg.id_san_pham = :productId OR bt.id_san_pham = :productId)
        AND (dg.an_hien IS NULL OR dg.an_hien = 1)
    `, {
      replacements: { productId: product.id },
      type: db.QueryTypes.SELECT
    });

    const totalReviews = Number(stats?.totalReviews) || 0;
    const avgRating = totalReviews > 0 ? Number(stats.avgRating) : 0;

    res.json({
      success: true,
      data: {
        ...product.toJSON(),
        reviews,
        avgRating: avgRating.toFixed(1),
        totalReviews
      }
    });
  } catch (error) {
    console.error('Error getting product detail:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết sản phẩm',
      error: error.message
    });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 4, page = 1, sort = 'newest', brand_ids, category_ids, min_price, max_price, min_rating } = req.query;
    const offset = (page - 1) * limit;

    // Xác định thứ tự sắp xếp
    let order = [];
    switch (sort) {
      case 'newest': order = [['created_at', 'DESC']]; break;
      case 'price_asc': order = [['fixed_price', 'ASC']]; break;
      case 'price_desc': order = [['fixed_price', 'DESC']]; break;
      case 'popular': order = [['view_count', 'DESC']]; break;
      default: order = [['created_at', 'DESC']];
    }

    const whereConditions = {
      deleted_at: null,
      status: 'con_hang',
    };

    if (category_ids) {
      const ids = category_ids.split(',').map(id => parseInt(id));
      whereConditions.category_id = { [Op.in]: ids };
    } else {
      whereConditions[Op.or] = [
        { category_id: categoryId },
        db.literal(`id_danh_muc IN (SELECT id FROM danh_muc WHERE slug = '${categoryId}')`)
      ];
    }

    if (brand_ids) {
      const ids = brand_ids.split(',').map(id => parseInt(id));
      whereConditions.brand_id = { [Op.in]: ids };
    }

    if (min_price || max_price) {
      whereConditions.fixed_price = {};
      if (min_price) whereConditions.fixed_price[Op.gte] = parseFloat(min_price);
      if (max_price) whereConditions.fixed_price[Op.lte] = parseFloat(max_price);
    }

    const conditionsArray = [whereConditions];

    if (min_rating) {
      // Logic lọc theo số sao (lấy các sản phẩm có đánh giá trung bình >= min_rating)
      conditionsArray.push(db.literal(`
        COALESCE((
          SELECT AVG(sao) 
          FROM danh_gia dg 
          JOIN chi_tiet_don_hang ct ON dg.id_chi_tiet_don_hang = ct.id 
          JOIN bien_the bt ON ct.id_bien_the = bt.id 
          WHERE bt.id_san_pham = Product.id
        ), 5) >= ${parseFloat(min_rating)}
      `));
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: { [Op.and]: conditionsArray },
      include: [
        {
          model: ProductImage, as: 'images',
          required: false,
          limit: 1
        },
        {
          model: Brand, as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,  as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductVariant, as: 'variants',
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: order
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm theo danh mục',
      error: error.message
    });
  }
};

// Tìm kiếm sản phẩm theo từ khóa
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, limit = 12, page = 1, sort = 'relevance' } = req.query;
    const offset = (page - 1) * limit;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        success: false, message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const cleanKeyword = keyword.trim();

    // Xác định thứ tự sắp xếp
    let order = [];
    switch (sort) {
      case 'relevance':
        order = [['view_count', 'DESC'], ['created_at', 'DESC']];
        break;
      case 'newest':
        order = [['created_at', 'DESC']];
        break;
      case 'price_asc':
        order = [['fixed_price', 'ASC']];
        break;
      case 'price_desc':
        order = [['fixed_price', 'DESC']];
        break;
      default:
        order = [['view_count', 'DESC']];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { name: { [Op.like]: `%${cleanKeyword}%` } },
              { description: { [Op.like]: `%${cleanKeyword}%` } },
              { short_description: { [Op.like]: `%${cleanKeyword}%` } },
              { product_code: { [Op.like]: `%${cleanKeyword}%` } },
              db.literal(`brand.ten_thuong_hieu LIKE '%${cleanKeyword.replace(/'/g, "''")}%'`),
              db.literal(`category.ten_danh_muc LIKE '%${cleanKeyword.replace(/'/g, "''")}%'`)
            ]
          },
          { deleted_at: null }
        ]
      },
      include: [
        {
          model: ProductImage,
          as: 'images',
          required: false,
          limit: 1
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductVariant,
          as: 'variants',
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: order,
      distinct: true
    });

    res.json({
      success: true,
      keyword: cleanKeyword,
      data: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm sản phẩm',
      error: error.message
    });
  }
};

// Lấy danh sách sản phẩm đang có đấu giá (để hiển thị trên trang chủ)
exports.getAuctionProducts = async (req, res) => {
  try {
    const { limit = 12, page = 1, sort = 'ending_soon' } = req.query;
    const offset = (page - 1) * limit;

    // Lấy danh sách product_id đang có đấu giá active
    const activeAuctions = await Auction.findAll({
      where: {
        status: 'active',
        end_time: { [Op.gt]: new Date() }
      },
      attributes: ['product_id'],
      group: ['product_id'],
      raw: true
    });

    const productIds = activeAuctions.map(a => a.product_id);

    if (productIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      });
    }

    // Xác định thứ tự sắp xếp cho products
    let productOrder = [['created_at', 'DESC']];
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        id: { [Op.in]: productIds },
        deleted_at: null,
        status: 'con_hang'
      },
      include: [
        {
          model: ProductImage,
          as: 'images',
          required: false,
          limit: 1
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'slug', 'logo_url']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductVariant,
          as: 'variants',
          required: false,
          limit: 1
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: productOrder,
      distinct: true
    });

    // Thêm thông tin đấu giá cho mỗi sản phẩm
    const productsWithAuction = await Promise.all(
      products.map(async (product) => {
        const productJson = product.toJSON();

        // Lấy phiên đấu giá active của sản phẩm
        const auction = await Auction.findOne({
          where: {
            product_id: product.id,
            status: 'active',
            end_time: { [Op.gt]: new Date() }
          },
          order: [['end_time', 'ASC']] // Lấy phiên sắp kết thúc nhất
        });

        if (!auction) {
          return null; // Skip nếu không có auction
        }

        // Đếm tổng số lượt đấu giá
        const totalBids = await Bid.count({
          where: { 
            auction_id: auction.id,
            status: { [Op.ne]: 'cancelled' }
          }
        });

        // Lấy giá cao nhất hiện tại
        const highestBid = await Bid.findOne({
          where: { 
            auction_id: auction.id,
            status: { [Op.in]: ['active', 'winning'] }
          },
          order: [['bid_amount', 'DESC']],
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'full_name', 'avatar_url']
            }
          ]
        });

        const currentPrice = highestBid 
          ? parseFloat(highestBid.bid_amount) 
          : parseFloat(auction.start_price);

        // Tính thời gian còn lại
        const now = new Date();
        const endTime = new Date(auction.end_time);
        const timeRemaining = Math.max(0, endTime - now);
        
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const daysRemaining = Math.floor(hoursRemaining / 24);

        return {
          ...productJson,
          auction: {
            id: auction.id,
            start_price: parseFloat(auction.start_price),
            min_increment: parseFloat(auction.min_increment),
            buy_now_price: auction.buy_now_price ? parseFloat(auction.buy_now_price) : null,
            start_time: auction.start_time,
            end_time: auction.end_time,
            status: auction.status,
            totalBids: totalBids,
            currentPrice: currentPrice,
            highestBidder: highestBid ? {
              id: highestBid.bidder.id,
              full_name: highestBid.bidder.full_name,
              avatar_url: highestBid.bidder.avatar_url
            } : null,
            timeRemaining: {
              milliseconds: timeRemaining,
              hours: hoursRemaining,
              minutes: minutesRemaining,
              days: daysRemaining,
              isEndingSoon: hoursRemaining <= 24 && hoursRemaining > 0,
              formatted: daysRemaining > 0 
                ? `${daysRemaining} ngày ${hoursRemaining % 24} giờ`
                : `${hoursRemaining} giờ ${minutesRemaining} phút`
            }
          }
        };
      })
    );

    // Lọc bỏ null và sắp xếp theo yêu cầu
    let filteredProducts = productsWithAuction.filter(p => p !== null);

    // Sắp xếp lại theo sort parameter
    switch (sort) {
      case 'ending_soon':
        filteredProducts.sort((a, b) => 
          a.auction.timeRemaining.milliseconds - b.auction.timeRemaining.milliseconds
        );
        break;
      case 'most_bids':
        filteredProducts.sort((a, b) => 
          b.auction.totalBids - a.auction.totalBids
        );
        break;
      case 'highest_price':
        filteredProducts.sort((a, b) => 
          b.auction.currentPrice - a.auction.currentPrice
        );
        break;
      case 'lowest_price':
        filteredProducts.sort((a, b) => 
          a.auction.currentPrice - b.auction.currentPrice
        );
        break;
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.auction.start_time) - new Date(a.auction.start_time)
        );
        break;
    }

    res.json({
      success: true,
      data: filteredProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting auction products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm đấu giá',
      error: error.message
    });
  }
};

// Lấy lịch sử đấu giá của một sản phẩm
exports.getProductAuctionHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: auctions } = await Auction.findAndCountAll({
      where: {
        product_id: productId
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: ProductImage,
              as: 'images',
              required: false,
              limit: 1
            }
          ]
        },
        {
          model: User,
          as: 'winner',
          attributes: ['id', 'full_name', 'avatar_url']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Thêm thông tin chi tiết
    const auctionsWithDetails = await Promise.all(
      auctions.map(async (auction) => {
        const totalBids = await Bid.count({
          where: { auction_id: auction.id }
        });

        const highestBid = await Bid.findOne({
          where: { auction_id: auction.id },
          order: [['bid_amount', 'DESC']]
        });

        const finalPrice = auction.status === 'ended' && highestBid
          ? parseFloat(highestBid.bid_amount)
          : null;

        return {
          ...auction.toJSON(),
          totalBids,
          finalPrice
        };
      })
    );

    res.json({
      success: true,
      data: auctionsWithDetails,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting product auction history:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử đấu giá sản phẩm',
      error: error.message
    });
  }
};

// controllers/productController.js
exports.getCartProducts = async (req, res) => {
  try {

    // 1️. Lấy danh sách variant_ids từ query
    const variantIds = req.query.variant_ids
      ? req.query.variant_ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      : [];

    if (variantIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu danh sách variant_ids',});
    }

    // 2. Truy vấn bảng ProductVariant, join sang Product, Brand, Image
    const variants = await ProductVariant.findAll({
      where: { id: variantIds },
      attributes: [
        'id', 'product_id', 'sku', 'strap_color', 'strap_material',
        'dial_color', 'case_size', 'variant_price'
      ],
      include: [
        {
          model: Product, as: 'product', attributes: ['id', 'name', 'slug'],
          include: [
            { model: Brand, as: 'brand', attributes: ['id', 'name', 'slug'] },
            {
              model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'alt_text'],  required: false, limit: 1
            }
          ]
        }
      ]
    });

    // 3 Chuẩn hoá dữ liệu trả về
    const data = variants.map(v => ({
      variant_id: v.id,
      product_id: v.product?.id,
      sku: v.sku,
      variant_price: v.variant_price,
      strap_color: v.strap_color,
      strap_material: v.strap_material,
      dial_color: v.dial_color,
      case_size: v.case_size,
      product_name: v.product?.name,
      brand: v.product?.brand ? {
        id: v.product.brand.id,
        name: v.product.brand.name,
        slug: v.product.brand.slug
      } : null,
      image_url: v.product?.images?.[0]?.image_url || null
    }));

    // 4️ Trả kết quả
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting cart products:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi lấy danh sách sản phẩm trong giỏ hàng',
      error: error.message
    });
  }
};
