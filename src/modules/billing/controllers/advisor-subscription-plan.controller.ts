import { Request, Response, NextFunction } from "express";
import { SubscriptionPlan } from '../models/subscription-plan.model';
import logger from '../../../winston';
import { createSubscriptionPlanSchema } from '../validators/advisor';
import {
  SUBSCRIPTION_PLAN_CREATE_SUCCESS,
  SUBSCRIPTION_PLAN_DELETE_SUCCESS
} from '../../../const/billing/billing-message.const';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { subscriptionPlanIdParamSchema } from '../validators/common';

export const getSubscriptionPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    const subscriptionPlans = await SubscriptionPlan.find({ user: req.user._id, advisor: req.params.advisorId });
    return res.json({ success: true, data: { subscriptionPlans } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const createSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await createSubscriptionPlanSchema.validateAsync(req.body);
    const subscriptionPlan = await SubscriptionPlan.findOneAndUpdate(
      {
        user: req.user._id,
        advisor: req.params.advisorId,
      },
      {
        ...req.body,
        advisor: req.params.advisorId,
        user: req.user._id
      }, { upsert: true });
    return res.json({ success: true, message: SUBSCRIPTION_PLAN_CREATE_SUCCESS, data: { subscriptionPlan } })
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await subscriptionPlanIdParamSchema.validateAsync(req.params);
    const subscriptionPlan = await SubscriptionPlan.findOne({
      user: req.user._id, advisor: req.params.advisorId,
      _id: req.params.subscriptionPlanId,
    });
    return res.json({ success: true, data: { subscriptionPlan } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const deleteSubscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await subscriptionPlanIdParamSchema.validateAsync(req.params);
    await SubscriptionPlan.deleteOne({
      user: req.user._id, advisor: req.params.advisorId,
      _id: req.params.subscriptionPlanId
    });
    return res.json({ success: true, message: SUBSCRIPTION_PLAN_DELETE_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};