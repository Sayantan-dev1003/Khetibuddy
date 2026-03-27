const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/auth.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Private routes
router.get('/me', protect, getMe);

module.exports = router;
