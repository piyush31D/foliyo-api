import { Request, Response, NextFunction } from "express";
import mongoose, { FilterQuery } from 'mongoose';
import { SubscriptionPlan } from '../models/subscription-plan.model';
import logger from '../../../winston';
import {
  INVESTOR_CANCEL_SUBSCRIPTION_SUCCESS,
  INVESTOR_SUBSCRIPTION_EXISTS,
  INVESTOR_SUBSCRIPTION_NOT_FOUND,
  INVESTOR_SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_PLAN_NOT_FOUND,
  SUBSCRIPTION_PLAN_PRICING_NOT_FOUND
} from '../../../const/billing/billing-message.const';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { investorIdParamSchema } from '../../../validators/investor';
import { subscriptionIdParamSchema, subscriptionPlanIdParamSchema } from '../validators/common';
import { subscribeAdvisorSubscriptionPlanSchema, subscriptionQuerySchema } from '../validators/investor';
import { IInvestorSubscription, SubscriptionStatus } from '../@types/susbscription-plan.type';
import { InvestorSubscription, InvestorSubscriptionDocument } from '../models/investor-subscription.model';

export const getAdvisorSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await investorIdParamSchema.validateAsync(req.params);
    await advisorIdParamSchema.validateAsync(req.params);
    const subscriptionPlans = await SubscriptionPlan.find({ advisor: req.params.advisorId });
    return res.json({ success: true, data: { subscriptionPlans } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const subscribeAdvisorSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await investorIdParamSchema.validateAsync(req.params);
    await subscriptionPlanIdParamSchema.validateAsync(req.params);
    await subscribeAdvisorSubscriptionPlanSchema.validateAsync(req.body);
    const { pricing }: IInvestorSubscription = req.body;
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const subscriptionPlanId = mongoose.Types.ObjectId(req.params.subscriptionPlanId);
    const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new Error(SUBSCRIPTION_PLAN_NOT_FOUND);
    }
    const subscriptionPricing = subscriptionPlan.pricings.find((planPricing) => planPricing.planInterval === pricing.planInterval && planPricing.amount === pricing.amount);
    if (!subscriptionPricing) {
      throw new Error(SUBSCRIPTION_PLAN_PRICING_NOT_FOUND);
    }
    const investorSubscription = await InvestorSubscription.findOne({
      subscriptionPlan: subscriptionPlanId,
      investor: investorId,
      subscriptionStatus: SubscriptionStatus.ACTIVE
    })
    if (investorSubscription) {
      throw new Error(INVESTOR_SUBSCRIPTION_EXISTS);
    }
    await new InvestorSubscription({
      investor: investorId,
      user: req.user._id,
      advisor: subscriptionPlan.advisor,
      subscriptionPlan: subscriptionPlanId,
      ...req.body
    }).save();
    return res.json({ success: true, message: INVESTOR_SUBSCRIPTION_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const cancelAdvisorSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await investorIdParamSchema.validateAsync(req.params);
    await subscriptionIdParamSchema.validateAsync(req.params);
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const subscriptionId = mongoose.Types.ObjectId(req.params.subscriptionId);
    const subscriptionPlan = await InvestorSubscription.findOne({
      investor: investorId,
      _id: subscriptionId
    });
    if (!subscriptionPlan) {
      throw new Error(INVESTOR_SUBSCRIPTION_NOT_FOUND);
    }
    await InvestorSubscription.findOneAndUpdate({
      investor: investorId,
      _id: subscriptionId
    },
      {
        $set: {
          subscriptionStatus: SubscriptionStatus.CANCELLED
        }
      });
    return res.json({ success: true, message: INVESTOR_CANCEL_SUBSCRIPTION_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

type SubscriptionQuery = {
  subscriptionStatus?: SubscriptionStatus
}

export const getAllSubscriptions = async (req: Request<{ investorId: string }, {}, {}, SubscriptionQuery>, res: Response, next: NextFunction) => {
  try {
    await investorIdParamSchema.validateAsync(req.params);
    await subscriptionQuerySchema.validateAsync(req.query);
    const { subscriptionStatus } = req.query;
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const filterQuery: FilterQuery<InvestorSubscriptionDocument> = {
      investor: investorId,
      user: req.user._id,
      subscriptionStatus: SubscriptionStatus.ACTIVE
    };
    if (subscriptionStatus) {
      filterQuery.subscriptionStatus = subscriptionStatus;
    }
    const subscriptions = await InvestorSubscription.find(filterQuery);
    return res.json({ success: true, data: { subscriptions } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};