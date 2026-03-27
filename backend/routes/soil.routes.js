const express = require('express');
const router = express.Router();
const { checkSoilHealth } = require('../controllers/soil.controller');
const upload = require('../config/multer');

router.post('/health', checkSoilHealth);

// OCR endpoint - temporarily disabled (requires Python OCR service)
// router.post('/ocr', upload.single('file'), handleOCR);

module.exports = router;
