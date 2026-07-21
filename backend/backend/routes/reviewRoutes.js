const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.get('/status/:productId', authMiddleware, reviewController.getMyReviewStatus);
router.post('/', authMiddleware, reviewController.createReview);

module.exports = router;
