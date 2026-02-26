const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// GET /users - admin only: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, { users });
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// DELETE /users/:id - admin only: delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    await user.deleteOne();
    return successResponse(res, null, 'User deleted');
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { getAllUsers, deleteUser };
