const db = require('../config/database');
const { generateOTP, sendOTPEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

/**
 * Send OTP to user's email
 */
const sendOTP = async (req, res) => {
  console.log('🚀 [SEND-OTP] Function called');
  try {
    const { email } = req.body;
    console.log('📧 [SEND-OTP] Email received:', email);

    if (!email) {
      console.log('⚠️ [SEND-OTP] No email provided');
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('⚠️ [SEND-OTP] Invalid email format');
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    console.log('✅ [SEND-OTP] Email validation passed');

    // Generate OTP
    const otp = generateOTP();
    console.log('🔐 [SEND-OTP] OTP generated:', otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Hash OTP before storing
    console.log('🔒 [SEND-OTP] Hashing OTP...');
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log('✅ [SEND-OTP] OTP hashed successfully');

    // Delete any existing OTPs for this email
    console.log('🗑️ [SEND-OTP] Deleting old OTPs...');
    await db.query('DELETE FROM otps WHERE email = $1', [email]);
    console.log('✅ [SEND-OTP] Old OTPs deleted');

    // Store OTP in database
    console.log('💾 [SEND-OTP] Storing new OTP in database...');
    await db.query(
      'INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)',
      [email, hashedOTP, expiresAt]
    );
    console.log('✅ [SEND-OTP] OTP stored in database');

    // Send OTP via email
    console.log('📧 [SEND-OTP] Sending email...');
    await sendOTPEmail(email, otp);
    console.log('✅ [SEND-OTP] Email sent successfully');

    const response = { 
      success: true, 
      message: 'OTP sent successfully to your email',
      expiresIn: 300 // 5 minutes in seconds
    };
    console.log('📤 [SEND-OTP] Sending response:', response);
    res.json(response);

  } catch (error) {
    console.error('❌ [SEND-OTP] ERROR:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP. Please try again.' 
    });
  }
};

/**
 * Verify OTP and sign in user
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and OTP are required' 
      });
    }

    // Get the latest OTP for this email
    const result = await db.query(
      'SELECT * FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No OTP found. Please request a new one.' 
      });
    }

    const otpRecord = result.rows[0];

    // Check if OTP has expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      await db.query('DELETE FROM otps WHERE email = $1', [email]);
      return res.status(400).json({ 
        success: false, 
        error: 'OTP has expired. Please request a new one.' 
      });
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= 3) {
      await db.query('DELETE FROM otps WHERE email = $1', [email]);
      return res.status(400).json({ 
        success: false, 
        error: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      // Increment attempts
      await db.query(
        'UPDATE otps SET attempts = attempts + 1 WHERE id = $1',
        [otpRecord.id]
      );

      const remainingAttempts = 3 - (otpRecord.attempts + 1);
      return res.status(400).json({ 
        success: false, 
        error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` 
      });
    }

    // OTP is valid - delete it
    await db.query('DELETE FROM otps WHERE email = $1', [email]);

    // Check if user exists
    let userResult = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const newUser = await db.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING *',
        [email]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Generate JWT tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Check if profile is complete
    const isProfileComplete = !!(user.name && user.phone);

    console.log('✅ [VERIFY-OTP] Login successful for:', user.email);
    console.log('📋 [VERIFY-OTP] Profile complete:', isProfileComplete);

    // Return user data with tokens
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.created_at
      },
      accessToken,
      refreshToken,
      expiresIn: 604800, // 7 days in seconds
      isProfileComplete
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify OTP. Please try again.' 
    });
  }
};

/**
 * Get current user from JWT token
 * Requires authentication middleware
 */
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;

    // Fetch fresh user data from database
    const result = await db.query(
      'SELECT id, email, name, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const user = result.rows[0];

    console.log('✅ [GET-USER] Retrieved user:', user.email);

    res.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ [GET-USER] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user' 
    });
  }
};

/**
 * Update user profile (name and phone)
 * Requires authentication middleware
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Validate input
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required'
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number'
      });
    }

    // Update user profile
    const result = await db.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING *',
      [name, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = result.rows[0];

    console.log('✅ [UPDATE-PROFILE] Profile updated for:', user.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ [UPDATE-PROFILE] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getCurrentUser,
  updateProfile,
};
