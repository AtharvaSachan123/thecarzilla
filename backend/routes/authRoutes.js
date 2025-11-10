const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getCurrentUser, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Send OTP to email
router.post('/send-otp', sendOTP);

// Verify OTP and login
router.post('/verify-otp', verifyOTP);

// Get current user (protected route - requires JWT token)
router.get('/me', authenticateToken, getCurrentUser);

// Update user profile (protected route - requires JWT token)
router.post('/me', authenticateToken, updateProfile);

module.exports = router;
