const { query } = require('../config/db');

class ProductModel {
  static async findMany({ search, category_slug, min_price, max_price, sort = 'newest', page = 1, limit = 12 }) {
    let text = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const values = [];
    let idx = 1;

    if (search) {
      text += ` AND (p.title ILIKE $${idx} OR p.description ILIKE $${idx})`;
      values.push(`%${search}%`);
      idx++;
    }
    if (category_slug) {
      text += ` AND c.slug = $${idx}`;
      values.push(category_slug);
      idx++;
    }
    if (min_price) {
      text += ` AND p.price >= $${idx}`;
      values.push(min_price);
      idx++;
    }
    if (max_price) {
      text += ` AND p.price <= $${idx}`;
      values.push(max_price);
      idx++;
    }

    if (sort === 'price_asc') text += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') text += ' ORDER BY p.price DESC';
    else if (sort === 'rating') text += ' ORDER BY p.rating DESC';
    else text += ' ORDER BY p.created_at DESC'; // newest

    text += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, (page - 1) * limit);

    const { rows } = await query(text, values);
    return rows;
  }

  static async findById(id) {
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0];
  }

  static async findBySlug(slug) {
    const text = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.slug = $1
    `;
    const { rows } = await query(text, [slug]);
    return rows[0];
  }

  static async create(data) {
    const { seller_id, category_id, title, slug, description, price, stock, images } = data;
    const text = `
      INSERT INTO products (seller_id, category_id, title, slug, description, price, stock, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const { rows } = await query(text, [seller_id, category_id, title, slug, description, price, stock, images]);
    return rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    values.push(id);
    const text = `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    
    const { rows } = await query(text, values);
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = ProductModel;
