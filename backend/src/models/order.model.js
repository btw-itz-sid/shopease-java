const { query } = require('../config/db');

class OrderModel {
  static async create({ buyer_id, items, subtotal, discount, delivery_fee, tax, total_amount, shipping_address }, client) {
    const text = `
      INSERT INTO orders (buyer_id, items, subtotal, discount, delivery_fee, tax, total_amount, shipping_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      buyer_id, JSON.stringify(items), subtotal, discount, delivery_fee, tax, total_amount, JSON.stringify(shipping_address)
    ];
    
    // Use transaction client if provided, else use default pool
    const executor = client || { query };
    const { rows } = await executor.query(text, values);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const { rows } = await query('SELECT * FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const { rows } = await query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
    return rows[0];
  }
}

module.exports = OrderModel;
