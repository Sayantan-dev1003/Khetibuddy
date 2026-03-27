const express = require('express');
const { loginUser } = require('../controllers/login.controller.js');

const router = express.Router();
router.post('/', loginUser);

module.exports = router;
    