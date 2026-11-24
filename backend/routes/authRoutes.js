const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

// Protected profile route
router.get('/profile', verifyToken, getProfile);

module.exports = router;
