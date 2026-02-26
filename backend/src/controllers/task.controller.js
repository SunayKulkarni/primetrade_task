const Task = require('../models/Task');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// POST /tasks - create a task
const createTask = async (req, res) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const task = await Task.create({ ...value, owner: req.user._id });
    return successResponse(res, { task }, 'Task created', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// GET /tasks - get all tasks (users: own tasks, admins: all tasks)
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    // Users see only their tasks; admins see all
    if (req.user.role !== 'admin') {
      filter.owner = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).populate('owner', 'name email').sort({ createdAt: -1 });
    return successResponse(res, { tasks });
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// GET /tasks/:id - get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email');

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Check ownership (or admin)
    if (req.user.role !== 'admin' && task.owner._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to access this task', 403);
    }

    return successResponse(res, { task });
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// PUT /tasks/:id - update task
const updateTask = async (req, res) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to update this task', 403);
    }

    task = await Task.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true }).populate(
      'owner',
      'name email'
    );

    return successResponse(res, { task }, 'Task updated');
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// DELETE /tasks/:id - delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this task', 403);
    }

    await task.deleteOne();
    return successResponse(res, null, 'Task deleted');
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
