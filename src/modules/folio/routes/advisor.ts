import { Express } from "express";
import {
  addIntrumentsToFolio,
  addInvestorsToFolio,
  createFolio,
  getAllFolios,
  getFolio,
  updateFolio,
  updateIntrumentInFolio
} from "../controllers/advisor-folio.controller";

export = (app: Express) => {
  app.route('/api/advisor/:advisorId/folio')
    .post(createFolio)
    .get(getAllFolios);

  app.route('/api/advisor/:advisorId/folio/:folioId')
    .put(updateFolio)
    .get(getFolio);

  app.route('/api/advisor/:advisorId/folio/:folioId/instrument')
    .post(addIntrumentsToFolio);

  app.route('/api/advisor/:advisorId/folio/:folioId/instrument/:instrumentId')
    .put(updateIntrumentInFolio);

  app.route('/api/advisor/:advisorId/folio/:folioId/investor')
    .post(addInvestorsToFolio);
}