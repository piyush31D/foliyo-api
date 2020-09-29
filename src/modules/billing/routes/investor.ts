import { Express } from "express";
import {
  getAdvisorSubscriptionPlans,
  subscribeAdvisorSubscriptionPlans,
  cancelAdvisorSubscriptionPlan
} from "../controllers/investor-subscription-plan.controller";

export = (app: Express) => {
  app.route('/api/investor/:investorId/advisor/:advisorId/subscriptionplan')
    .get(getAdvisorSubscriptionPlans);

  app.route('/api/investor/:investorId/subscriptionplan/:subscriptionPlanId')
    .post(subscribeAdvisorSubscriptionPlans)
    .delete(cancelAdvisorSubscriptionPlan);
}