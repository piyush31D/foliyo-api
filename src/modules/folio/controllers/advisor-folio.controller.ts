import { Request, Response, NextFunction } from "express";
import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import logger from '../../../winston';
import { IConstituent } from '../@types/folio-type';
import APIError from '../../../error';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { folioIdParamSchema } from '../validators/common';
import { Investor, InvestorDocument } from '../../profile/models/investor-profile.model';
import { MasterFolio } from '../models/master-folio.model';
import { FOLIO_NOT_FOUND } from '../../../const/folio/folio-message.const';
import { createFolioSchema } from '../validators/advisor';
import { InvestorFolio } from '../models/investor-folio.model';
import _ from 'lodash';

export const getAllFolios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    const folios = await MasterFolio.find({ advisor: req.params.advisorId, user: req.user._id });
    return res.json({ success: true, data: { folios } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getFolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await folioIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const folioId = mongoose.Types.ObjectId(req.params.folioId);
    const folio = await MasterFolio.findOne({ advisor: advisorId, _id: folioId });
    if (!folio) {
      throw new APIError(FOLIO_NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return res.json({ success: true, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

interface CreateFolio {
  name: string;
  investors?: string[];
  investorGroups?: string[];
  constituents?: IConstituent[];
}

export const createFolio = async (req: Request<{ advisorId: string }, {}, CreateFolio>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await createFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const { investors, investorGroups, constituents } = req.body;
    const folio = new MasterFolio({
      name: req.body.name,
      advisor: advisorId,
      user: req.user._id
    });
    await Investor.find({ _id: { $in: investors }, })
    const filterQuery: FilterQuery<InvestorDocument> = { $or: [] };
    if (investors && investors.length) {
      const investorIds = investors.map((investor) => mongoose.Types.ObjectId(investor));
      folio.investors = investorIds;
      filterQuery.$or.push({ $in: investorIds });
    }
    if (investorGroups && investorGroups.length) {
      const investorGroupIds = investorGroups.map((investorGroup) => mongoose.Types.ObjectId(investorGroup));
      folio.investorGroups = investorGroupIds;
      filterQuery.$or.push({ $in: investorGroupIds })
    }
    if (constituents && constituents.length) {
      folio.constituents = constituents;
    }
    if (filterQuery.$or.length) {
      const session = await mongoose.startSession();
      session.startTransaction();
      const investors = await Investor.find(filterQuery);
      const investorFolios = investors.map((investor) => new InvestorFolio({
        masterFolio: folio._id,
        investor: investor._id,
        user: investor.user,
        constituents: folio.constituents
      }));
      await InvestorFolio.insertMany(investorFolios);
      await folio.save();
      await session.commitTransaction();
      session.endSession();
    } else {
      await folio.save();
    }
    return res.json({ success: true, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}