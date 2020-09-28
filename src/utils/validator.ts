import { CustomValidator } from '@hapi/joi';
import validator from "validator";
import mongoose from 'mongoose';

export const customMobileValidator: CustomValidator = (value, helper) => {
  if (!validator.isMobilePhone(value, 'en-IN')) {
    return helper.error('any.invalid');
  }
  return value;
}

export const customMongoObjectIdValidator: CustomValidator = (value, helper) => {
  if (!mongoose.isValidObjectId(value)) {
    return helper.error('any.invalid');
  }
  return value;
}