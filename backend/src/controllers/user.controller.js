const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// GET /users - admin only: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    logger.info('All users fetched', { adminId: req.user._id, count: users.length });
    return successResponse(res, { users });
  } catch (err) {
    logger.error('Get all users error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// DELETE /users/:id - admin only: delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn('User not found for deletion', { targetUserId: req.params.id, adminId: req.user._id });
      return errorResponse(res, 'User not found', 404);
    }
    
    const deletedEmail = user.email;
    await user.deleteOne();
    logger.info('User deleted', { deletedUserId: req.params.id, deletedEmail, adminId: req.user._id });
    return successResponse(res, null, 'User deleted');
  } catch (err) {
    logger.error('Delete user error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { getAllUsers, deleteUser };
