import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import { SubscriptionPlan } from '../models/subscription-plan.model';
import logger from '../../../winston';
import {
  INVESTOR_CANCEL_SUBSCRIPTION_SUCCESS,
  INVESTOR_SUBSCRIPTION_EXISTS,
  INVESTOR_SUBSCRIPTION_NOT_FOUND,
  INVESTOR_SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_PLAN_NOT_FOUND
} from '../../../const/billing/billing-message.const';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { investorIdParamSchema } from '../../../validators/investor';
import { subscriptionPlanIdParamSchema } from '../validators/common';
import { Investor } from '../../../modules/profile/models/investor-profile.model';

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
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const subscriptionPlanId = mongoose.Types.ObjectId(req.params.subscriptionPlanId);
    const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new Error(SUBSCRIPTION_PLAN_NOT_FOUND);
    }
    if (subscriptionPlan.subscribers.indexOf(investorId) >= 0) {
      throw new Error(INVESTOR_SUBSCRIPTION_EXISTS);
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    subscriptionPlan.subscribers.push(investorId);
    await subscriptionPlan.save();
    await Investor.findByIdAndUpdate(investorId, { $push: { subscriptions: subscriptionPlanId } });
    await session.commitTransaction();
    session.endSession();
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
    const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      throw new Error(SUBSCRIPTION_PLAN_NOT_FOUND);
    }
    if (subscriptionPlan.subscribers.indexOf(investorId) < 0) {
      throw new Error(INVESTOR_SUBSCRIPTION_NOT_FOUND);
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    await SubscriptionPlan.findByIdAndUpdate(subscriptionPlanId, {
      $pull: {
        subscribers: investorId
      }
    });
    await Investor.findByIdAndUpdate(investorId, { $pull: { subscriptions: subscriptionPlanId } });
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, message: INVESTOR_CANCEL_SUBSCRIPTION_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};