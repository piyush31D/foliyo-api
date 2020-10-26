import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const folioIdParamSchema = Joi.object({
  folioId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();

export const instrumentIdParamSchema = Joi.object({
  instrumentId: Joi.string().custom(customMongoObjectIdValidator),
}).unknown().required();