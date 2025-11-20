const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ [AUTH] Token verification failed:', err.message);
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    console.log('✅ [AUTH] Token verified for user:', user.email);
    req.user = user;
    next();
  });
};

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  // Token expires in 7 days
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
  });

  console.log('🔑 [AUTH] Token generated for user:', user.email);
  return token;
};

/**
 * Generate refresh token (longer expiration)
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Refresh token expires in 30 days
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '30d' 
  });

  return refreshToken;
};

module.exports = {
  authenticateToken,
  generateToken,
  generateRefreshToken,
};
