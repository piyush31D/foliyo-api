import Joi, { ValidationError } from '@hapi/joi';
import validator from "validator";

export const userSigninSchema = Joi.object({
  mobile: Joi.string().custom((value, helper) => {
    if (!validator.isMobilePhone(value, 'en-IN')) {
      return helper.error('any.invalid');
    }
    return value;
  })
}).unknown().required();

export const verifyOTPSchema = Joi.object({
  mobile: Joi.string().custom((value, helper) => {
    if (!validator.isMobilePhone(value, 'en-IN')) {
      return helper.error('any.invalid');
    }
    return value;
  }),
  otp: Joi.string().required().length(6) //TODO: add regex for number validation
}).unknown().required();

export const createValidatePINSchema = Joi.object({
  mobile: Joi.string().custom((value, helper) => {
    if (!validator.isMobilePhone(value, 'en-IN')) {
      return helper.error('any.invalid');
    }
    return value;
  }),
  pin: Joi.string().required().length(6) //TODO: add regex for number validation
}).unknown().required();