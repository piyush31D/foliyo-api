import { Express } from "express";
import {
  createFolio,
  getAllFolios,
  getFolio
} from "../controllers/advisor-folio.controller";

export = (app: Express) => {
  app.route('/api/advisor/:advisorId/folio')
    .post(createFolio)
    .get(getAllFolios);

  app.route('/api/advisor/:advisorId/folio/:folioId')
    .get(getFolio);
}