import { Express } from "express";
import {
  getAdvisorSubscriptionPlans,
  subscribeAdvisorSubscriptionPlan,
  cancelAdvisorSubscriptionPlan,
  getAllSubscriptions
} from "../controllers/investor-subscription-plan.controller";

export = (app: Express) => {
  app.route('/api/investor/:investorId/advisor/:advisorId/subscriptionplan')
    .get(getAdvisorSubscriptionPlans);

  app.route('/api/investor/:investorId/subscriptionplan/:subscriptionPlanId')
    .post(subscribeAdvisorSubscriptionPlan);

  app.route('/api/investor/:investorId/subscription')
    .get(getAllSubscriptions);

  app.route('/api/investor/:investorId/subscription/:subscriptionId')
    .delete(cancelAdvisorSubscriptionPlan);
}