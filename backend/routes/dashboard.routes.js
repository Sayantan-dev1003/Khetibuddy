const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats - Get overall statistics
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/recent-activity - Get recent activities
router.get('/recent-activity', dashboardController.getRecentActivity);

// GET /api/dashboard/crop-health - Get crop health overview
router.get('/crop-health', dashboardController.getCropHealthOverview);

module.exports = router;
