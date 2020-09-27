import { Express } from "express";
import {
  createAdvisorProfile,
  getAdvisorProfile
} from "../controllers/advisor.controller";

export = (app: Express) => {
  app.route('/api/advisor/profile')
    .get(getAdvisorProfile)
    .post(createAdvisorProfile);
}