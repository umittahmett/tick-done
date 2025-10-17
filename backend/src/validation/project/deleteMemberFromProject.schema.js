import Joi from 'joi'

export const deleteMemberFromProjectSchema = Joi.object({
  params: Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Project ID must be a valid hex string.', 'any.required': 'Project ID is required' })
  }).required(),
  
  body: Joi.object({
    email: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' })
  })
  .required(), 
  
  query: Joi.object().optional().unknown(false), 
});

