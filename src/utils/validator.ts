import { CustomValidator } from '@hapi/joi';
import validator from "validator";

export const customMobileValidator: CustomValidator = (value, helper) => {
  if (!validator.isMobilePhone(value, 'en-IN')) {
    return helper.error('any.invalid');
  }
  return value;
}