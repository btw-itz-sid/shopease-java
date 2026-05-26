const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All cart routes require auth

router.route('/')
  .get(cartController.getCart)
  .post(cartController.addItem)
  .delete(cartController.clearCart);

router.route('/:productId')
  .put(cartController.updateItem)
  .delete(cartController.removeItem);

module.exports = router;
