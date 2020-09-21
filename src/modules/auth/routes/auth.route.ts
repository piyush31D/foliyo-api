import { Express } from "express";
import {
  userSignin,
  setupPIN,
  verifyOTP,
  verifyPIN
} from "../controllers/auth.controller";

export = (app: Express) => {
  app.route('/api/auth/user')
    .post(userSignin);
  app.route('/api/auth/otp')
    .post(verifyOTP);
  app.route('/api/auth/pin')
    .post(verifyPIN)
    .put(setupPIN);
}