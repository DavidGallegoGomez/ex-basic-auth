const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.get('/register', auth.register);

module.exports = router;
