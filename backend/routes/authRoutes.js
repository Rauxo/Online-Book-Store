const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
