import { Express } from "express";
import {
  createUser
} from "../controllers/investor-auth-controller";

export = (app: Express) => {
  app.route('/api/auth/investor/signin')
    .post(createUser);
}