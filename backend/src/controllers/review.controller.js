const ReviewModel = require('../models/review.model');

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.findByProductId(req.params.productId);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const { productId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Valid rating between 1 and 5 is required' });
    }

    const review = await ReviewModel.create({
      product_id: productId,
      buyer_id: req.user.id,
      rating,
      comment,
      images
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
