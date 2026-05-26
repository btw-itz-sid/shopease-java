const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// GET /api/products?search=...&cat=...&min_price=...&sort=...
// POST /api/products (seller/admin only)
router.route('/')
  .get(productController.getProducts)
  .post(protect, authorize('seller', 'admin'), productController.createProduct);

// GET /api/products/featured
router.get('/featured', productController.getFeaturedProducts);

// GET /api/products/:slug
// PUT /api/products/:slug (seller/admin)
// DELETE /api/products/:slug (seller/admin)
router.route('/:slug')
  .get(productController.getProductBySlug)
  .put(protect, authorize('seller', 'admin'), productController.updateProduct)
  .delete(protect, authorize('seller', 'admin'), productController.deleteProduct);

module.exports = router;
