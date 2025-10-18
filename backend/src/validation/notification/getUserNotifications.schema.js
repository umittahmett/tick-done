import Joi from 'joi';

export const getUserNotificationsSchema = Joi.object({
  body: Joi.object().optional().unknown(false), 
  params: Joi.object().optional().unknown(false),
  
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20).messages({ 'number.min': 'Limit must be at least 1', 'number.max': 'Limit cannot exceed 100' }),     
    status: Joi.string().valid('read', 'unread').optional().messages({ 'string.valid': 'Invalid status value. Must be "read" or "unread"' }),
    type: Joi.string().valid('projectInvite', 'taskAssignment', 'taskDue', 'generic').optional().messages({ 'string.valid': 'Invalid type value. Must be "projectInvite", "taskAssignment", "taskDue", or "generic"' }),
    channel: Joi.string().valid('app', 'email').optional().messages({ 'string.valid': 'Invalid channel value. Must be "app" or "email"' }),
  }).optional(),
});
