const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, uploadController.uploadImages);

module.exports = router;
