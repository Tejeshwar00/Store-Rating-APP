const express = require('express');
const { register, login, updatePassword } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;
