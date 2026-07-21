const Article = require('../models/Article');
const { Op } = require('sequelize');

// Public: Lấy tất cả bài viết hiển thị
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { an_hien: 1 },
      order: [['ngay_dang', 'DESC']]
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Public: Lấy chi tiết bài viết
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      where: { id: id, an_hien: 1 }
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    // Tăng lượt xem
    article.luot_xem += 1;
    await article.save();

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article details:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Admin: Lấy danh sách bài viết (tất cả, kể cả ẩn)
exports.adminGetArticles = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { tieu_de: { [Op.like]: `%${search}%` } },
        { noi_dung: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: articles } = await Article.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      data: articles,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Admin get articles error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy bài viết', error: error.message });
  }
};

// Admin: Chi tiết bài viết cho chỉnh sửa
exports.adminGetArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Admin get article by id error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết bài viết', error: error.message });
  }
};

// Admin: Tạo mới bài viết
exports.adminCreateArticle = async (req, res) => {
  try {
    const { tieu_de, noi_dung, an_hien, id_loai_bai_viet, luot_xem, luot_thich, luot_chia_se } = req.body;
    let hinh = req.file ? req.file.filename : null;

    if (!tieu_de || !noi_dung) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung không được trống' });
    }

    // Sinh slug ngẫu nhiên từ tiêu đề hoặc tạo ngẫu nhiên
    const rawSlug = tieu_de.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const slug = `${rawSlug}-${Date.now()}`;

    const article = await Article.create({
      tieu_de,
      noi_dung,
      hinh,
      slug,
      id_loai_bai_viet: id_loai_bai_viet || null,
      luot_xem: luot_xem !== undefined ? parseInt(luot_xem) : 0,
      luot_thich: luot_thich !== undefined ? parseInt(luot_thich) : 0,
      luot_chia_se: luot_chia_se !== undefined ? parseInt(luot_chia_se) : 0,
      an_hien: an_hien !== undefined ? (an_hien == 'true' || an_hien === true || an_hien == 1 ? 1 : 0) : 1,
      ngay_dang: new Date()
    });

    res.json({ success: true, message: 'Đăng bài viết thành công', data: article });
  } catch (error) {
    console.error('Admin create article error:', error);
    res.status(500).json({ success: false, message: 'Lỗi tạo bài viết', error: error.message });
  }
};

// Admin: Cập nhật bài viết
exports.adminUpdateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { tieu_de, noi_dung, an_hien, id_loai_bai_viet, luot_xem, luot_thich, luot_chia_se } = req.body;
    
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    let hinh = article.hinh;
    if (req.file) {
      hinh = req.file.filename;
    }

    // Cập nhật slug nếu tiêu đề thay đổi
    let slug = article.slug;
    if (tieu_de && tieu_de !== article.tieu_de) {
      const rawSlug = tieu_de.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      slug = `${rawSlug}-${Date.now()}`;
    }

    await article.update({
      tieu_de: tieu_de || article.tieu_de,
      noi_dung: noi_dung || article.noi_dung,
      hinh,
      slug,
      id_loai_bai_viet: id_loai_bai_viet !== undefined ? id_loai_bai_viet : article.id_loai_bai_viet,
      luot_xem: luot_xem !== undefined ? parseInt(luot_xem) : article.luot_xem,
      luot_thich: luot_thich !== undefined ? parseInt(luot_thich) : article.luot_thich,
      luot_chia_se: luot_chia_se !== undefined ? parseInt(luot_chia_se) : article.luot_chia_se,
      an_hien: an_hien !== undefined ? (an_hien == 'true' || an_hien === true || an_hien == 1 ? 1 : 0) : article.an_hien
    });

    res.json({ success: true, message: 'Cập nhật bài viết thành công', data: article });
  } catch (error) {
    console.error('Admin update article error:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật bài viết', error: error.message });
  }
};

// Admin: Xóa bài viết
exports.adminDeleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    await article.destroy();
    res.json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error) {
    console.error('Admin delete article error:', error);
    res.status(500).json({ success: false, message: 'Lỗi xóa bài viết', error: error.message });
  }
};
