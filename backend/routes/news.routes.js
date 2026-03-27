const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

// GET /api/news?state=all|gujarat|kerala
router.get('/', newsController.getNews);

// POST /api/news/clear-cache (for admin/testing)
router.post('/clear-cache', newsController.clearCache);

module.exports = router;
