const express = require('express');
const router = express.Router();
const misc = require('../controllers/misc.controller');

router.get('/', misc.home);

module.exports = router;
