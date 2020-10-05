import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const investorgroupIdParamSchema = Joi.object({
  investorgroup: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();