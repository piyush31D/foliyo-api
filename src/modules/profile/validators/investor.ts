import Joi from '@hapi/joi';
import { customMobileValidator } from '../../../utils/validator';

export const createInvestorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.string().custom(customMobileValidator).required(),
  email: Joi.string().email().required(),
  pan: Joi.string().required() //TODO: PAN validation
}).unknown().required();