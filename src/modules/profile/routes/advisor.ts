import { Express } from "express";
import {
  createAdvisorProfile,
  createInvestorGroup,
  deleteInvestorGroup,
  getAdvisorProfile,
  getInvestorGroup,
  getInvestorGroups,
  getInvestors,
  getInvestorsOverview,
  updateInvestorGroup,
  addInvestorToGroup,
  removeInvestorFromGroup
} from "../controllers/advisor.controller";

export = (app: Express) => {
  app.route('/api/advisor/profile')
    .get(getAdvisorProfile)
    .post(createAdvisorProfile);

  app.route('/api/advisor/:advisorId/investor/overview')
    .get(getInvestorsOverview);

  app.route('/api/advisor/:advisorId/investor')
    .get(getInvestors);

  app.route('/api/advisor/:advisorId/investor/:investorId')
    .get(getInvestors);

  app.route('/api/advisor/:advisorId/investorgroup')
    .get(getInvestorGroups)
    .get(createInvestorGroup);

  app.route('/api/advisor/:advisorId/investorgroup/:investorgroupId')
    .get(getInvestorGroup)
    .put(updateInvestorGroup)
    .delete(deleteInvestorGroup);

  app.route('/api/advisor/:advisorId/investorgroup/:investorgroupId/investor/:investorId')
    .post(addInvestorToGroup)
    .delete(removeInvestorFromGroup);
}