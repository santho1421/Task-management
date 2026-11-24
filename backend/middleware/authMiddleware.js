const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Protects private endpoints by validating the Bearer token in headers
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    // Extract token part
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing.',
      });
    }

    // Verify token using secret
    const secret = process.env.JWT_SECRET || 'taskflow_jwt_secret_key_2026_secure';
    const decoded = jwt.verify(token, secret);

    // Attach decoded user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = {
  verifyToken,
};
