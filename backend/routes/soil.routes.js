const express = require('express');
const router = express.Router();
const { checkSoilHealth } = require('../controllers/soil.controller');
const { protect } = require('../middlewares/auth.middleware');

// POST /api/soil/check
router.post('/check', protect, checkSoilHealth);

// OCR endpoint - temporarily disabled (requires Python OCR service)
// router.post('/ocr', upload.single('file'), handleOCR);

module.exports = router;
