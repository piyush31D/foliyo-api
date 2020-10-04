import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
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
import { subscriptionPlanIdParamSchema } from '../validators/common';
import { subscribeAdvisorSubscriptionPlanSchema } from '../validators/investor';
import { IInvestorSubscription, SubscriptionStatus } from '../@types/susbscription-plan.type';
import { InvestorSubscription } from '../models/investor-subscription.model';

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

export const subscribeAdvisorSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
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
      investor: investorId
    })
    if (investorSubscription) {
      throw new Error(INVESTOR_SUBSCRIPTION_EXISTS);
    }
    await new InvestorSubscription({
      investor: investorId,
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
    await subscriptionPlanIdParamSchema.validateAsync(req.params);
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const subscriptionPlanId = mongoose.Types.ObjectId(req.params.subscriptionPlanId);
    const subscriptionPlan = await InvestorSubscription.findOne({
      investor: investorId,
      subscriptionPlan: subscriptionPlanId
    });
    if (!subscriptionPlan) {
      throw new Error(INVESTOR_SUBSCRIPTION_NOT_FOUND);
    }

    await InvestorSubscription.findOneAndUpdate({
      investor: investorId,
      subscriptionPlan: subscriptionPlanId
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