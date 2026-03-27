const express = require('express');
const router = express.Router();
const { getFertilizerRecommendation} = require('../controllers/fertilizer.controller');

// POST /api/fertilizer/recommend
router.post('/recommend', getFertilizerRecommendation);

module.exports = router;
