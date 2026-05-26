const OrderModel = require('../models/order.model');
const CartModel = require('../models/cart.model');
const { getClient } = require('../config/db');

exports.createOrder = async (req, res) => {
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ success: false, message: 'Shipping address is required' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Get cart items using correct method name
    const cartItems = await CartModel.getCart(req.user.id);
    if (!cartItems || cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const price = parseFloat(item.price);
      subtotal += price * item.quantity;
      return {
        product_id: item.product_id,
        title: item.title,
        price,
        quantity: item.quantity,
        image_url: item.image || null
      };
    });

    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const delivery_fee = subtotal > 500 ? 0 : 50;
    const total_amount = parseFloat((subtotal + tax + delivery_fee).toFixed(2));

    const order = await OrderModel.create({
      buyer_id: req.user.id,
      items,
      subtotal,
      discount: 0,
      delivery_fee,
      tax,
      total_amount,
      shipping_address
    }, client);

    // Clear cart after successful order
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    await client.query('COMMIT');

    res.status(201).json({ success: true, data: order });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await OrderModel.findByUserId(req.user.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.buyer_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const updatedOrder = await OrderModel.updateStatus(req.params.id, status);
    res.json({ success: true, data: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
