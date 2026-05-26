const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/product/:productId', protect, reviewController.addReview);

module.exports = router;
