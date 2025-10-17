import Joi from 'joi'

export const registerSchema = Joi.object({
  body: Joi.object({
    fullname: Joi.string().min(3).required().messages({ 'string.min': 'Fullname must be at least 3 characters long.', 'any.required': 'Fullname is required' }),
    title: Joi.string().required().messages({ 'any.required': 'Title is required' }),
    email: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' }),
    password: Joi.string().min(5).required().messages({ 'string.min': 'Password must be at least 6 characters long.', 'any.required': 'Password is required' })
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
