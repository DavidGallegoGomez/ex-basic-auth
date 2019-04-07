const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/users.controller');

router.get('/', secure.isAuthenticated, users.list);
router.post('/:id/delete', secure.isAuthenticated, users.delete);

module.exports = router;
