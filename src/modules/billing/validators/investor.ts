import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';

export const subscribeAdvisorSubscriptionPlanSchema = Joi.object({
  pricing: Joi.object({
    amount: Joi.number().required(),
    percentage: Joi.number().required(),
    planInterval: Joi.string().required(), //TODO: Add enum
  }),
  promotion: Joi.string().custom(customMongoObjectIdValidator)
}).required();