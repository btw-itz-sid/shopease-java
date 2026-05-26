const CategoryModel = require('../models/category.model');
const slugify = require('slugify');

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await CategoryModel.findBySlug(req.params.slug);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url, parent_id } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const slug = slugify(name, { lower: true, strict: true });
    const category = await CategoryModel.create({ name, slug, description, image_url, parent_id });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Category already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
};
