const express = require('express');
const { getMe } = require('../controllers/user.controller.js');

const router = express.Router();

// GET /api/profile (no auth for now)
router.get('/', getMe);

module.exports = router;