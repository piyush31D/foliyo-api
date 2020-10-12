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
  }).required()
}).required();


export const createInvestorGroupSchema = Joi.object({
  name: Joi.string().required(),
  investors: Joi.array().items(customMobileValidator).required(),
  automatic: Joi.boolean() //TODO: Add validation for criteria if true
}).required();

export const updateInvestorGroupSchema = Joi.object({
  name: Joi.string().required(),
  automatic: Joi.boolean()
}).required();

export const addRemoveInvestorsToGroupSchema = Joi.object({
  investors: Joi.array().items(customMobileValidator).required()
}).required();