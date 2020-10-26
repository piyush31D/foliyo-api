import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const createFolioSchema = Joi.object({
  name: Joi.string().required(),
  investors: Joi.array().items(customMongoObjectIdValidator),
  investorGroups: Joi.array().items(customMongoObjectIdValidator),
  instruments: Joi.array().items(Joi.object({
    instrument: Joi.string().custom(customMongoObjectIdValidator),
    lots: Joi.number(),
    quantity: Joi.number()
  }))
}).required();

export const updateFolioSchema = Joi.object({
  name: Joi.string().required()
}).required();

export const addIntrumentsToFolioSchema = Joi.object({
  instruments: Joi.array().items(Joi.object({
    instrument: Joi.string().custom(customMongoObjectIdValidator),
    lots: Joi.number(),
    quantity: Joi.number()
  }))
}).required();

export const updateIntrumentInFolioSchema = Joi.object({
  instrument: Joi.object({
    lots: Joi.number(),
    quantity: Joi.number()
  })
}).required();


export const addInvestorsToFolioSchema = Joi.object({
  investors: Joi.array().items(customMongoObjectIdValidator),
  investorGroups: Joi.array().items(customMongoObjectIdValidator),
}).required();
