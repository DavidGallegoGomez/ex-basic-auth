const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
router.get('/login', auth.login);
router.post('/login', auth.doLogin);

module.exports = router;
