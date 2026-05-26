const { query } = require('../config/db');

class CategoryModel {
  static async findAll() {
    const { rows } = await query('SELECT * FROM categories WHERE is_active = true ORDER BY name ASC');
    return rows;
  }

  static async findBySlug(slug) {
    const { rows } = await query('SELECT * FROM categories WHERE slug = $1 AND is_active = true', [slug]);
    return rows[0];
  }

  static async create({ name, slug, description, image_url, parent_id }) {
    const text = `
      INSERT INTO categories (name, slug, description, image_url, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await query(text, [name, slug, description, image_url, parent_id]);
    return rows[0];
  }
}

module.exports = CategoryModel;
