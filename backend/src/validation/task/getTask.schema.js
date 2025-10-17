import Joi from 'joi'

export const getTaskSchema = Joi.object({
  params: Joi.object({
    taskId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Task ID must be a valid hex string.', 'any.required': 'Task ID is required' })
  }).required(), 
  
  body: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
