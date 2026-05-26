require('dotenv').config();
const { query, connectDB } = require('../src/config/db');
const logger = require('../src/utils/logger');

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(150) UNIQUE NOT NULL,
  phone            VARCHAR(15),
  password_hash    VARCHAR(255) NOT NULL,
  role             VARCHAR(10) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
  avatar_url       VARCHAR(500),
  is_verified      BOOLEAN DEFAULT FALSE,
  is_suspended     BOOLEAN DEFAULT FALSE,
  verify_token     VARCHAR(255),
  reset_token      VARCHAR(255),
  reset_expires    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  slug        VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  title          VARCHAR(200) NOT NULL,
  slug           VARCHAR(230) UNIQUE NOT NULL,
  description    TEXT NOT NULL,
  price          DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2),
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images         TEXT[] DEFAULT '{}',
  tags           TEXT[] DEFAULT '{}',
  rating         DECIMAL(3,2) DEFAULT 0.00,
  review_count   INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_seller  ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items            JSONB NOT NULL DEFAULT '[]',
  subtotal         DECIMAL(10,2) NOT NULL,
  discount         DECIMAL(10,2) DEFAULT 0,
  delivery_fee     DECIMAL(10,2) DEFAULT 0,
  tax              DECIMAL(10,2) DEFAULT 0,
  total_amount     DECIMAL(10,2) NOT NULL,
  status           VARCHAR(20) DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  shipping_address JSONB NOT NULL,
  promo_code       VARCHAR(50),
  tracking_id      VARCHAR(100),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_buyer  ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id VARCHAR(100),
  razorpay_pay_id   VARCHAR(100),
  method            VARCHAR(20) CHECK (method IN ('card','upi','netbanking','cod','wallet')),
  status            VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','success','failed','refunded')),
  amount            DECIMAL(10,2) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  images     TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, buyer_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- Cart (server-side cart for persistence)
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Promo codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  discount_type   VARCHAR(10) CHECK (discount_type IN ('percent','fixed')) DEFAULT 'percent',
  discount_value  DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS \$\$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; \$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated    ON users;
DROP TRIGGER IF EXISTS trg_products_updated ON products;
DROP TRIGGER IF EXISTS trg_orders_updated   ON orders;
CREATE TRIGGER trg_users_updated    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated   BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`;

const migrate = async () => {
  try {
    await connectDB();
    await query(schema);
    logger.info('✅ Database migration complete — all tables created');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed: ' + err.message);
    process.exit(1);
  }
};

migrate();
