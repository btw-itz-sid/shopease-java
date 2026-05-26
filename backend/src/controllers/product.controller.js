const ProductModel = require('../models/product.model');
const slugify = require('slugify');

exports.getProducts = async (req, res) => {
  try {
    const { search, cat, min_price, max_price, sort, page, limit } = req.query;
    const products = await ProductModel.findMany({
      search,
      category_slug: cat,
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
      sort: sort || 'newest',
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 12
    });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await ProductModel.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await ProductModel.findMany({ sort: 'newest', limit: 8, page: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    req.body.seller_id = req.user.id;
    if (!req.body.title || !req.body.price || !req.body.description) {
      return res.status(400).json({ success: false, message: 'Title, price, and description are required' });
    }
    req.body.slug = slugify(req.body.title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
    const product = await ProductModel.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await ProductModel.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
    }

    product = await ProductModel.update(product.id, req.body);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await ProductModel.delete(product.id);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
