const { query } = require('../config/db');

class ReviewModel {
  static async findByProductId(productId) {
    const text = `
      SELECT r.*, u.name as user_name, u.avatar_url 
      FROM reviews r
      JOIN users u ON r.buyer_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const { rows } = await query(text, [productId]);
    return rows;
  }

  static async create({ product_id, buyer_id, rating, comment, images }) {
    const text = `
      INSERT INTO reviews (product_id, buyer_id, rating, comment, images)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await query(text, [product_id, buyer_id, rating, comment, images || []]);
    return rows[0];
  }
}

module.exports = ReviewModel;
