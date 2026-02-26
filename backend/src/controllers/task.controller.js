const Task = require('../models/Task');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// POST /tasks - create a task
const createTask = async (req, res) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      logger.warn('Task creation validation failed', { userId: req.user._id, errors: error.details });
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    const task = await Task.create({ ...value, owner: req.user._id });
    logger.info('Task created', { taskId: task._id, userId: req.user._id, title: task.title });
    return successResponse(res, { task }, 'Task created', 201);
  } catch (err) {
    logger.error('Task creation error', { error: err.message, stack: err.stack });
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
    logger.info('Tasks fetched', { userId: req.user._id, count: tasks.length, filter });
    return successResponse(res, { tasks });
  } catch (err) {
    logger.error('Get tasks error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// GET /tasks/:id - get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email');

    if (!task) {
      logger.warn('Task not found', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Task not found', 404);
    }

    // Check ownership (or admin)
    if (req.user.role !== 'admin' && task.owner._id.toString() !== req.user._id.toString()) {
      logger.warn('Unauthorized task access attempt', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Not authorized to access this task', 403);
    }

    return successResponse(res, { task });
  } catch (err) {
    logger.error('Get task error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// PUT /tasks/:id - update task
const updateTask = async (req, res) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) {
      logger.warn('Task update validation failed', { taskId: req.params.id, errors: error.details });
      return errorResponse(res, 'Validation error', 400, error.details);
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      logger.warn('Task not found for update', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Task not found', 404);
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      logger.warn('Unauthorized task update attempt', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Not authorized to update this task', 403);
    }

    task = await Task.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true }).populate(
      'owner',
      'name email'
    );

    logger.info('Task updated', { taskId: task._id, userId: req.user._id, updates: value });
    return successResponse(res, { task }, 'Task updated');
  } catch (err) {
    logger.error('Task update error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

// DELETE /tasks/:id - delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      logger.warn('Task not found for deletion', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Task not found', 404);
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      logger.warn('Unauthorized task deletion attempt', { taskId: req.params.id, userId: req.user._id });
      return errorResponse(res, 'Not authorized to delete this task', 403);
    }

    await task.deleteOne();
    logger.info('Task deleted', { taskId: req.params.id, userId: req.user._id });
    return successResponse(res, null, 'Task deleted');
  } catch (err) {
    logger.error('Task deletion error', { error: err.message, stack: err.stack });
    return errorResponse(res, err.message || 'Server error', 500);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
