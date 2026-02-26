const { errorResponse } = require('../utils/apiResponse');

// 404 handler
const notFound = (req, res, next) => {
  return errorResponse(res, 'Route not found', 404);
};

// Global error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode, err.errors || null);
};

module.exports = { notFound, errorHandler };
