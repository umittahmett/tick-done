import Joi from 'joi';

export const forgotPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({ 'any.required': 'Email is required.','string.email': 'Please enter a valid email address.'}),
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
