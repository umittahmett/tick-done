import Joi from 'joi';
import { AppError } from '../utils/appError.js';

/**
 * Joi şemasını kullanarak gelen isteği (req.body, req.params, req.query) doğrulayan evrensel middleware.
 * @param {Joi.ObjectSchema} schema - Doğrulama için kullanılacak Joi şeması.
 * @returns {Function} Express.js middleware fonksiyonu.
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    const dataToValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };
    
    await schema.validateAsync(dataToValidate, {
        abortEarly: false, 
    });

    next();
  } catch (error) {
    
    if (error.isJoi) {
      const errorMessages = error.details.map(detail => detail.message).join(' | ');  
      const validationError = new AppError(`Validation Error: ${errorMessages}`, 400);
      
      return next(validationError);
    }
    
    next(error);
  }
};