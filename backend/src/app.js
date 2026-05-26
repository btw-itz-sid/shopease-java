const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes       = require('./routes/auth.routes');
const productRoutes    = require('./routes/product.routes');
const categoryRoutes   = require('./routes/category.routes');
const cartRoutes       = require('./routes/cart.routes');
const orderRoutes      = require('./routes/order.routes');
const paymentRoutes    = require('./routes/payment.routes');
const reviewRoutes     = require('./routes/review.routes');
const uploadRoutes     = require('./routes/upload.routes');
const adminRoutes      = require('./routes/admin.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' }
});
app.use('/api/', globalLimiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ success: true, message: 'ShopEase API is healthy', env: process.env.NODE_ENV })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/upload',     uploadRoutes);
app.use('/api/admin',      adminRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
