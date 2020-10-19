import { Express } from "express";
import {
  getInstruments
} from "../controllers/instrument-controller";

export = (app: Express) => {
  app.route('/api/instrument')
    .get(getInstruments)
}