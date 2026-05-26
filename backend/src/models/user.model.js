const { query } = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, email, password_hash, role = 'buyer' }) {
    const text = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await query(text, [name, email, password_hash, role]);
    return rows[0];
  }

  static async updateAvatar(id, avatar_url) {
    const { rows } = await query(
      'UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [avatar_url, id]
    );
    return rows[0];
  }
}

module.exports = UserModel;
