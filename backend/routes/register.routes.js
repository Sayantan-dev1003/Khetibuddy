const express = require('express');
const { registerUser } = require('../controllers/register.controller.js');

const router = express.Router();
router.post('/', registerUser);

module.exports = router;