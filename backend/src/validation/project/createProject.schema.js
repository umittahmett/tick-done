import Joi from 'joi'

export const createProjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).required().messages({ 'string.min': 'Name must be at least 3 characters long.', 'any.required': 'Name is required' }),
    description: Joi.string()
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
