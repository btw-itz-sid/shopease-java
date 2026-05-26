const CartModel = require('../models/cart.model');

exports.getCart = async (req, res) => {
  try {
    const items = await CartModel.getCart(req.user.id);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const item = await CartModel.addItem({ user_id: req.user.id, product_id, quantity: quantity || 1 });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }

    const item = await CartModel.updateQuantity(req.user.id, productId, quantity);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    await CartModel.removeItem(req.user.id, req.params.productId);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartModel.clearCart(req.user.id);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
