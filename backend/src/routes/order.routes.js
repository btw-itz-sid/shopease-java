const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .post(orderController.createOrder)
  .get(orderController.getMyOrders);

router.route('/:id')
  .get(orderController.getOrderById)
  .put(authorize('admin', 'seller'), orderController.updateOrderStatus);

module.exports = router;
