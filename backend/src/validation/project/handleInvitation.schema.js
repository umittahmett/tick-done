import Joi from 'joi'

export const handleInvitationSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('accept', 'reject').required().messages({ 'any.required': 'Status is required' }),
    token: Joi.string().required().messages({ 'any.required': 'Token is required' })
  }).required(), 

  params: Joi.object().optional().unknown(false), 
  query: Joi.object().optional().unknown(false), 
});
