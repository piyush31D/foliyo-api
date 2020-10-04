import { Express } from "express";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan
} from "../controllers/advisor-subscription-plan.controller";

export = (app: Express) => {
  app.route('/api/advisor/:advisorId/subscriptionplan')
    .get(getSubscriptionPlans)
    .post(createSubscriptionPlan);

  app.route('/api/advisor/:advisorId/subscriptionplan/:subscriptionPlanId')
    .get(getSubscriptionPlan)
    .put(updateSubscriptionPlan)
    .delete(deleteSubscriptionPlan);
}