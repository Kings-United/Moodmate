const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authControllers');

const router = express.Router();

// Public routes
router.post('/register', authController.register);

// Protected routes
router.post('/login', authenticateToken, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;