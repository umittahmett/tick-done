import Joi from 'joi'

export const verifyOtpSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({ 'string.email': 'Please enter a valid email address.', 'any.required': 'Email is required' }),
    otp: Joi.string().length(6).required().messages({ 'string.length': 'OTP must be 6 characters long.', 'any.required': 'OTP is required' })
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
