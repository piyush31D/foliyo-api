import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const subscriptionPlanIdParamSchema = Joi.object({
  subscriptionPlanId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();

export const subscriptionIdParamSchema = Joi.object({
  subscriptionId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();