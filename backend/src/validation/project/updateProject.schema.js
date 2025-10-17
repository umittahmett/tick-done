import Joi from 'joi'

export const updateProjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).required().messages({ 'string.min': 'Name must be at least 3 characters long.', 'any.required': 'Name is required' }),
    description: Joi.string()
  }).min(1).required().messages({ 'any.required': 'At least one field is required' }), 

  params: Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Project ID must be a valid hex string.', 'any.required': 'Project ID is required' })
  }).required(), 

  query: Joi.object().optional().unknown(false), 
});
