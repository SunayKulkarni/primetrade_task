const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('MONGODB_URI is not defined in environment');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error('MongoDB connection error', { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
