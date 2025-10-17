import Joi from 'joi'

export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' }),
    newPassword: Joi.string().min(6).required().messages({ 'string.min': 'Password must be at least 6 characters long.', 'any.required': 'Password is required' })
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
