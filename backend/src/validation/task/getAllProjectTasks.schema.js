import Joi from 'joi'

export const getAllProjectTasksSchema = Joi.object({
  params: Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Project ID must be a valid hex string.', 'any.required': 'Project ID is required' })
  }).required(), 
  
  body: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
