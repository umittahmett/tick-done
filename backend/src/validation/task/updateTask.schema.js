import Joi from 'joi'

export const updateTaskSchema = Joi.object({
  params: Joi.object({
    taskId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Task ID must be a valid hex string.', 'any.required': 'Task ID is required' })
  }).required(), 
  
  body: Joi.object({
    title: Joi.string().min(3).optional().messages({ 'string.min': 'Title must be at least 3 characters long.' }),
    description: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional().messages({ 'string.valid': 'Priority must be one of: low, medium, high, urgent' }),
    dueDate: Joi.date().optional().messages({ 'date.base': 'Due date must be a valid date.' }),
    assignments: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('todo', 'in-progress', 'review', 'done').optional().messages({ 'string.valid': 'Status must be one of: todo, in-progress, review, done' }),
  }).min(1).required().messages({ 'any.required': 'At least one field is required' }),

  query: Joi.object().optional().unknown(false), 
});
