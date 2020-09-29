import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../utils/validator';

export const investorIdParamSchema = Joi.object({
  investorId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();