const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { checkCropDisease, detectDiseaseFromImage } = require('../controllers/cropDisease.controller');
const { protect } = require('../middlewares/auth.middleware');


// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'disease-' + uniqueSuffix + path.extname(file.originalname));
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

// Text-based detection (existing)
router.post('/detect', protect, checkCropDisease);

// Image-based detection (new)
router.post('/detect-image', protect, upload.single('image'), detectDiseaseFromImage);


module.exports = router;
