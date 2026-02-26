const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// GET /users - admin only: get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, { users });
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id - admin only: delete a user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    await user.deleteOne();
    return successResponse(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, deleteUser };
