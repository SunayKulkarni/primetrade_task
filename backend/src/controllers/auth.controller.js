const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { generateToken } = require('../utils/generateToken');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const { name, email, password, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken({ id: user._id, role: user.role });

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
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return successResponse(
      res,
      {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// GET /auth/me - get currently authenticated user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, { user });
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { register, login, getMe };
