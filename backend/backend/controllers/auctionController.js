const { Auction, Product, ProductImage, Brand, Bid, User, db } = require('../models');
const { Op } = require('sequelize');

// Lấy danh sách đấu giá đang diễn ra
exports.getActiveAuctions = async (req, res) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: auctions } = await Auction.findAndCountAll({
      where: {  status: 'active',  end_time: { [Op.gt]: new Date() } },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: ProductImage,
              as: 'images',
              where: { is_primary: true },
              required: false,
              limit: 1
            },
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name', 'slug']
            }
          ]
        },
        {
          model: Bid,
          as: 'bids',
          separate: true,
          order: [['bid_amount', 'DESC']],
          limit: 1,
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'full_name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['end_time', 'ASC']]
    });

    res.json({
      success: true,
      data: auctions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting active auctions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đấu giá',
      error: error.message
    });
  }
};

// Lấy chi tiết phiên đấu giá
exports.getAuctionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: ProductImage,
              as: 'images',
              order: [['display_order', 'ASC']]
            },
            {
              model: Brand,
              as: 'brand'
            }
          ]
        },
        {
          model: Bid,
          as: 'bids',
          order: [['bid_amount', 'DESC']],
          limit: 10,
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'full_name', 'avatar_url']
            }
          ]
        }
      ]
    });

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiên đấu giá'
      });
    }

    // Lấy giá cao nhất hiện tại
    const highestBid = auction.bids && auction.bids.length > 0 
      ? auction.bids[0].bid_amount 
      : auction.start_price;

    res.json({
      success: true,
      data: {
        ...auction.toJSON(),
        current_price: highestBid,
        total_bids: auction.bids ? auction.bids.length : 0
      }
    });
  } catch (error) {
    console.error('Error getting auction detail:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết đấu giá',
      error: error.message
    });
  }
};

// Đặt giá đấu giá
exports.placeBid = async (req, res) => {
  const t = await db.transaction();
  
  try {
    const { auctionId } = req.params;
    const { bid_amount } = req.body;
    const userId = req.user.id; // Từ middleware xác thực

    // Kiểm tra phiên đấu giá
    const auction = await Auction.findByPk(auctionId, { transaction: t });

    if (!auction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiên đấu giá'
      });
    }

    // Kiểm tra trạng thái
    if (auction.status !== 'active') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Phiên đấu giá không còn hoạt động'
      });
    }

    // Kiểm tra thời gian
    if (new Date() > new Date(auction.end_time)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Phiên đấu giá đã kết thúc'
      });
    }

    // Lấy giá cao nhất hiện tại
    const highestBid = await Bid.findOne({
      where: { auction_id: auctionId, status: 'winning' },
      order: [['bid_amount', 'DESC']],
      transaction: t
    });

    const currentPrice = highestBid ? highestBid.bid_amount : auction.start_price;

    // Kiểm tra giá đặt
    if (parseFloat(bid_amount) < parseFloat(currentPrice) + parseFloat(auction.min_increment)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Giá đặt phải cao hơn ${currentPrice + auction.min_increment} VNĐ`
      });
    }

    // Cập nhật trạng thái bid cũ
    if (highestBid) {
      await Bid.update(
        { status: 'outbid' },
        { 
          where: { 
            auction_id: auctionId, 
            status: 'winning' 
          },
          transaction: t 
        }
      );
    }

    // Tạo bid mới
    const newBid = await Bid.create({
      auction_id: auctionId,
      bidder_id: userId,
      bid_amount: bid_amount,
      status: 'winning',
      bidder_ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Đặt giá thành công',
      data: newBid
    });
  } catch (error) {
    await t.rollback();
    console.error('Error placing bid:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt giá',
      error: error.message
    });
  }
};

// Lấy lịch sử đấu giá của user
exports.getUserBids = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: bids } = await Bid.findAndCountAll({
      where: { bidder_id: userId },
      include: [
        {
          model: Auction,
          as: 'auction',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  where: { is_primary: true },
                  required: false,
                  limit: 1
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
      data: bids,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user bids:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử đấu giá',
      error: error.message
    });
  }
};
