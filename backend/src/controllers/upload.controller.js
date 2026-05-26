const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shopease',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage }).array('images', 5); // max 5 images

exports.uploadImages = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const urls = req.files.map(file => file.path);
    res.json({ success: true, data: urls });
  });
};
