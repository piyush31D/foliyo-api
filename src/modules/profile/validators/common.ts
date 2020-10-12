import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const investorgroupIdParamSchema = Joi.object({
  investorgroupId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();