const express = require('express');
const router = express.Router();
const { getFertilizerRecommendation} = require('../controllers/fertilizer.controller');
const { protect } = require('../middlewares/auth.middleware');


// POST /api/fertilizer/recommend
router.post('/recommend', protect, getFertilizerRecommendation);


module.exports = router;
