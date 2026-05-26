require('dotenv').config();
const bcrypt = require('bcryptjs');
const { query, connectDB } = require('../src/config/db');
const logger = require('../src/utils/logger');

const seed = async () => {
  await connectDB();

  // Admin user
  const hash = await bcrypt.hash('Admin@123', 12);
  await query(`
    INSERT INTO users (name, email, password_hash, role, is_verified)
    VALUES ('Super Admin', 'admin@shopease.com', $1, 'admin', true)
    ON CONFLICT (email) DO NOTHING
  `, [hash]);

  // Test seller
  const sellerHash = await bcrypt.hash('Seller@123', 12);
  await query(`
    INSERT INTO users (name, email, phone, password_hash, role, is_verified)
    VALUES ('Rajan Store', 'seller@shopease.com', '9876543210', $1, 'seller', true)
    ON CONFLICT (email) DO NOTHING
  `, [sellerHash]);

  // Test buyer
  const buyerHash = await bcrypt.hash('Buyer@123', 12);
  await query(`
    INSERT INTO users (name, email, password_hash, role, is_verified)
    VALUES ('Priya Sharma', 'buyer@shopease.com', $1, 'buyer', true)
    ON CONFLICT (email) DO NOTHING
  `, [buyerHash]);

  // Categories
  const categories = [
    ['Electronics',    'electronics',    'Gadgets, phones, laptops'],
    ['Clothing',       'clothing',       'Men, women and kids fashion'],
    ['Food & Grocery', 'food-grocery',   'Fresh and packaged food'],
    ['Home & Kitchen', 'home-kitchen',   'Furniture and appliances'],
    ['Books',          'books',          'Fiction, non-fiction and more'],
    ['Sports',         'sports',         'Fitness and outdoor gear'],
    ['Beauty',         'beauty',         'Skincare and cosmetics'],
  ];

  for (const [name, slug, desc] of categories) {
    await query(`
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING
    `, [name, slug, desc]);
  }

  // Promo code
  await query(`
    INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses)
    VALUES ('SAVE10', 'percent', 10, 500, 1000)
    ON CONFLICT (code) DO NOTHING
  `);

  logger.info('✅ Seed data inserted');
  logger.info('   admin@shopease.com  / Admin@123');
  logger.info('   seller@shopease.com / Seller@123');
  logger.info('   buyer@shopease.com  / Buyer@123');
  process.exit(0);
};

seed().catch(err => { logger.error(err.message); process.exit(1); });
