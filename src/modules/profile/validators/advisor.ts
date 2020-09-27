import Joi from '@hapi/joi';
import { customMobileValidator } from '../../../utils/validator';

//TODO: Handle individual and company details based on category
export const createAdvisorSchema = Joi.object({
  mobile: Joi.string().custom(customMobileValidator).required(),
  email: Joi.string().email().required(),
  pan: Joi.string().required(), //TODO: PAN validation
  individualDetails: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }).unknown().required()
}).unknown().required();