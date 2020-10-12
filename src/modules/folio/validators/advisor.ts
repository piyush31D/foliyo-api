import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const createFolioSchema = Joi.object({
  name: Joi.string().required(),
  investors: Joi.array().items(customMongoObjectIdValidator),
  investorGroups: Joi.array().items(customMongoObjectIdValidator),
  constituents: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    expiry: Joi.string(),
    strike: Joi.string(),
    segment: Joi.string().required(),
    lotSize: Joi.number().required(),
    lots: Joi.number(),
    quantity: Joi.number(),
    instrumentType: Joi.string()
  }))
}).required();
