const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { detectPest, getPestHistory } = require('../controllers/pest.controller');
const { protect } = require('../middlewares/auth.middleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pest-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG and PNG images are allowed'));
    }
  }
});

// Image-based pest detection
router.post('/detect', protect, upload.single('image'), detectPest);

// Get user's pest detection history
router.get('/history', protect, getPestHistory);

module.exports = router;
