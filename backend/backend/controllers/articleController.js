const Article = require('../models/Article');

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

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      where: { id: id, an_hien: 1 }
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    // Increment view count
    article.luot_xem += 1;
    await article.save();

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article details:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
