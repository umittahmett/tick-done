import Joi from 'joi'

export const addMemberToProjectSchema = Joi.object({
  body: Joi.object({
    invitee: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' }),
    inviter: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' })
  }).required(), 

  params: Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({ 'string.hex': 'Project ID must be a valid hex string.', 'any.required': 'Project ID is required' })
  }).required(),
  
  query: Joi.object().optional().unknown(false), 
});
