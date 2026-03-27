const express = require('express');
const { logoutUser } = require('../controllers/logout.controller.js');

const router = express.Router();

// POST /api/logout (no auth for now)
router.post('/', logoutUser);

module.exports = router;