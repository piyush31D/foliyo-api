import { Express } from "express";
import {
  getInvestorProfile,
  createInvestorProfile,
  getAdvisors,
  getAdvisor
} from "../controllers/investor.controller";

export = (app: Express) => {
  app.route('/api/investor/profile')
    .get(getInvestorProfile)
    .post(createInvestorProfile);
  app.route('/api/investor/:investorId/advisor')
    .get(getAdvisors);
  app.route('/api/investor/:investorId/advisor/:advisorId')
    .get(getAdvisor);
}