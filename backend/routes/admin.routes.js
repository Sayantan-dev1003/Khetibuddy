const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllUsers, 
  deleteUser, 
  getRecentActivities 
} = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

// Apply protection to all admin routes
router.use(protect);
router.use(isAdmin);

// @route   GET /api/admin/stats
router.get('/stats', getAdminStats);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// @route   GET /api/admin/activities
router.get('/activities', getRecentActivities);

module.exports = router;
