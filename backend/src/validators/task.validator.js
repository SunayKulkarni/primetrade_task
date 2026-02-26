const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
}).min(1); 

module.exports = { createTaskSchema, updateTaskSchema };
