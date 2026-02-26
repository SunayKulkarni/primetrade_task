const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { generateToken } = require('../utils/generateToken');
const logger = require('../utils/logger');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      logger.warn('Registration validation failed', { errors: error.details });
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const { name, email, password, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration attempt with existing email', { email });
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken({ id: user._id, role: user.role });

    logger.info('New user registered', { userId: user._id, email: user.email, role: user.role });

    return successResponse(
      res,
      {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (err) {
    logger.error('Registration error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      logger.warn('Login validation failed', { errors: error.details });
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.warn('Login attempt with incorrect password', { email });
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    logger.info('User logged in', { userId: user._id, email: user.email });

    return successResponse(
      res,
      {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    logger.error('Login error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// GET /auth/me - get currently authenticated user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      logger.warn('User not found for /me endpoint', { userId: req.user.id });
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, { user });
  } catch (err) {
    logger.error('Get me error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { register, login, getMe };
