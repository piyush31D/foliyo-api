import Joi, { ValidationError } from '@hapi/joi';
import validator from "validator";
export const userCreateSchema = Joi.object({
  mobile: Joi.string().custom((value, helper) => {
    if (!validator.isMobilePhone(value, 'en-IN')) {
      return helper.error('any.invalid');
    }
    return value;
  })
}).unknown().required();