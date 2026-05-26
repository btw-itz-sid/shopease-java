const { query } = require('../config/db');

class CartModel {
  static async getCart(userId) {
    const text = `
      SELECT c.*, p.title, p.price, p.stock, p.images[1] as image
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const { rows } = await query(text, [userId]);
    return rows;
  }

  static async addItem({ user_id, product_id, quantity }) {
    const text = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      RETURNING *
    `;
    const { rows } = await query(text, [user_id, product_id, quantity]);
    return rows[0];
  }

  static async updateQuantity(user_id, product_id, quantity) {
    const text = `
      UPDATE cart_items SET quantity = $1 
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `;
    const { rows } = await query(text, [quantity, user_id, product_id]);
    return rows[0];
  }

  static async removeItem(userId, productId) {
    await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  }

  static async clearCart(userId) {
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  }
}

module.exports = CartModel;
