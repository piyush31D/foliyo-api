import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../utils/validator';

export const advisorIdParamSchema = Joi.object({
  advisorId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();