const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);

module.exports = router;
