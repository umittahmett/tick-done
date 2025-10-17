import Joi from 'joi'

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).required().messages({ 'string.min': 'Title must be at least 3 characters long.', 'any.required': 'Title is required' }),
    description: Joi.string(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required().messages({ 'any.required': 'Priority is required' }),
    dueDate: Joi.date().required().messages({ 'any.required': 'Due date is required' }),
    assignments: Joi.array().items(Joi.string()).optional().messages({ 'array.base': 'Assignments must be an array of strings' }),
  }).required(), 

  params: Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Project ID must be a valid hex string.', 'any.required': 'Project ID is required' })
  }).required(), 

  query: Joi.object().optional().unknown(false), 
});
