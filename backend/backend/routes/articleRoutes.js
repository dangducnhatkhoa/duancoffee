const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Lấy danh sách tất cả bài viết
router.get('/', articleController.getAllArticles);

// Lấy chi tiết bài viết theo ID
router.get('/:id', articleController.getArticleById);

module.exports = router;
