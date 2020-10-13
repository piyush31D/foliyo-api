import Joi from '@hapi/joi';
import { customMongoObjectIdValidator } from '../../../utils/validator';
import { SubscriptionStatus } from '../@types/susbscription-plan.type';

export const subscribeAdvisorSubscriptionPlanSchema = Joi.object({
  pricing: Joi.object({
    amount: Joi.number().required(),
    percentage: Joi.number().required(),
    planInterval: Joi.string().required(), //TODO: Add enum
  }),
  promotion: Joi.string().custom(customMongoObjectIdValidator)
}).required()

export const subscriptionQuerySchema = Joi.object({
  subscriptionStatus: Joi.string().valid(...Object.values(SubscriptionStatus)),
});