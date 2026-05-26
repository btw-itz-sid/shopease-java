const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
  .get(categoryController.getCategories)
  .post(protect, authorize('admin'), categoryController.createCategory);

router.get('/:slug', categoryController.getCategoryBySlug);

module.exports = router;
