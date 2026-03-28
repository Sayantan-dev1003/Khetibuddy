const express = require('express');
const { getProfile, updateProfile, updatePassword } = require('../controllers/profile.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', updatePassword);

module.exports = router;