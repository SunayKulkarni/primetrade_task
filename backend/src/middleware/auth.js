const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

// Protect routes - require a valid JWT
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return errorResponse(res, 'User not found', 401);
    }
    next();
  } catch (err) {
    return errorResponse(res, 'Not authorized, token failed', 401);
  }
};

// Role-based access control
// Usage: authorize('admin') or authorize('admin', 'moderator')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Role '${req.user.role}' is not authorized`, 403);
    }
    next();
  };
};

module.exports = { protect, authorize };
