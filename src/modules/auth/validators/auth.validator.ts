import Joi from '@hapi/joi';
import { customMobileValidator } from '../../../utils/validator';

export const userSigninSchema = Joi.object({
  mobile: Joi.string().custom(customMobileValidator)
}).unknown().required();

export const verifyOTPSchema = Joi.object({
  mobile: Joi.string().custom(customMobileValidator),
  otp: Joi.string().required().length(6) //TODO: add regex for number validation
}).unknown().required();

export const createValidatePINSchema = Joi.object({
  mobile: Joi.string().custom(customMobileValidator),
  pin: Joi.string().required().length(6), //TODO: add regex for number validation
  pinToken: Joi.string().required()
}).unknown().required();