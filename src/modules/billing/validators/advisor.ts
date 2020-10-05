import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const createSubscriptionPlanSchema = Joi.object({
  name: Joi.string().required(),
  planType: Joi.string().required(), //TODO: Add enum
  minimumInvestment: Joi.number().required(),
  supportedProducts: Joi.array().items(Joi.string()), //TODO: Add enum
  pricings: Joi.array().items(Joi.object({
    amount: Joi.number().required(),
    percentage: Joi.number().required(),
    planInterval: Joi.string().required(), //TODO: Add enum
  })),
  features: Joi.array().items(Joi.string()),
  backgroundColor: Joi.string()
}).required();

export const createPlanPromotionSchema = Joi.object({
  name: Joi.string(),
  autoApply: Joi.boolean().required(),
  code: Joi.string().when('autoApply', {
    is: Joi.boolean().truthy(),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  discountType: Joi.string().required(),
  planIntervals: Joi.array().min(1).items(Joi.string()),
  amount: Joi.number().required(),
  percentage: Joi.number().required(),
  description: Joi.string().required(),
  expiry: Joi.date().required(),
  maxDiscount: Joi.number().required(),
  subscriptionPlans: Joi.array().items(Joi.custom(customMongoObjectIdValidator)).required().min(1)
}).required();