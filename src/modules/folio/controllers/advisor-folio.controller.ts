import { Request, Response, NextFunction } from "express";
import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import logger from '../../../winston';
import { IFolioInstrument } from '../@types/folio-type';
import APIError from '../../../error';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { folioIdParamSchema, instrumentIdParamSchema } from '../validators/common';
import { Investor, InvestorDocument } from '../../profile/models/investor-profile.model';
import { MasterFolio } from '../models/master-folio.model';
import { FOLIO_INSTRUMENT_UPDATE_SUCCESS, FOLIO_NOT_FOUND, FOLIO_UPDATE_SUCCESS } from '../../../const/folio/folio-message.const';
import { addIntrumentsToFolioSchema, addInvestorsToFolioSchema, createFolioSchema, updateFolioSchema } from '../validators/advisor';
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

export const updateFolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await folioIdParamSchema.validateAsync(req.params);
    await updateFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const folioId = mongoose.Types.ObjectId(req.params.folioId);
    const folio = await MasterFolio.findOneAndUpdate({
      _id: folioId,
      advisor: advisorId
    }, { $set: req.body }, { new: true });
    return res.json({ success: true, message: FOLIO_UPDATE_SUCCESS, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

interface CreateFolio {
  name: string;
  investors?: string[];
  investorGroups?: string[];
  instruments?: IFolioInstrument[];
}

export const createFolio = async (req: Request<{ advisorId: string }, {}, CreateFolio>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await createFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const { investors, investorGroups, instruments } = req.body;
    const folio = new MasterFolio({
      name: req.body.name,
      advisor: advisorId,
      user: req.user._id
    });
    const filterQuery: FilterQuery<InvestorDocument> = { $or: [] };
    if (investors && investors.length) {
      const investorIds = investors.map((investor) => mongoose.Types.ObjectId(investor));
      folio.investors = investorIds;
      filterQuery.$or.push({ _id: { $in: investorIds } });
    }
    if (investorGroups && investorGroups.length) {
      const investorGroupIds = investorGroups.map((investorGroup) => mongoose.Types.ObjectId(investorGroup));
      folio.investorGroups = investorGroupIds;
      filterQuery.$or.push({ groups: { $in: investorGroupIds } })
    }
    if (instruments && instruments.length) {
      folio.instruments = instruments;
    }
    if (filterQuery.$or.length) {
      const session = await mongoose.startSession();
      session.startTransaction();
      const investors = await Investor.find(filterQuery);
      const investorFolios = investors.map((investor) => new InvestorFolio({
        masterFolio: folio._id,
        investor: investor._id,
        user: investor.user,
        instruments: folio.instruments
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

export const addIntrumentsToFolio = async (req: Request<{ advisorId: string, folioId: string }, {}, CreateFolio>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await folioIdParamSchema.validateAsync(req.params);
    await addIntrumentsToFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const folioId = mongoose.Types.ObjectId(req.params.folioId);
    const { instruments } = req.body;
    const folio = await MasterFolio.findOne({ advisor: advisorId, _id: folioId });
    if (!folio) {
      throw new APIError(FOLIO_NOT_FOUND, httpStatus.NOT_FOUND);
    }
    if (instruments && instruments.length) {
      folio.instruments = [...folio.instruments, ...instruments];
    }
    await folio.save();
    return res.json({ success: true, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const updateIntrumentInFolio = async (req: Request<{ advisorId: string, folioId: string, instrumentId: string }, {}, {}>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await folioIdParamSchema.validateAsync(req.params);
    await instrumentIdParamSchema.validateAsync(req.params);
    await addIntrumentsToFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const folioId = mongoose.Types.ObjectId(req.params.folioId);
    const instrumentId = mongoose.Types.ObjectId(req.params.instrumentId);
    const folio = await MasterFolio.findOneAndUpdate({ advisor: advisorId, _id: folioId, "instruments.instrument": instrumentId }, { $set: { "instruments.$": { ...req.body, instrument: instrumentId } } });
    return res.json({ success: true, message: FOLIO_INSTRUMENT_UPDATE_SUCCESS, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const addInvestorsToFolio = async (req: Request<{ advisorId: string, folioId: string }, {}, CreateFolio>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await folioIdParamSchema.validateAsync(req.params);
    await addInvestorsToFolioSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const folioId = mongoose.Types.ObjectId(req.params.folioId);
    const { investors, investorGroups } = req.body;
    const folio = await MasterFolio.findOne({ advisor: advisorId, _id: folioId });
    if (!folio) {
      throw new APIError(FOLIO_NOT_FOUND, httpStatus.NOT_FOUND);
    }
    const filterQuery: FilterQuery<InvestorDocument> = { $or: [] };
    if (investors && investors.length) {
      const investorIds = investors.map((investor) => mongoose.Types.ObjectId(investor));
      folio.investors = investorIds;
      filterQuery.$or.push({ _id: { $in: investorIds } });
    }
    if (investorGroups && investorGroups.length) {
      const investorGroupIds = investorGroups.map((investorGroup) => mongoose.Types.ObjectId(investorGroup));
      folio.investorGroups = investorGroupIds;
      filterQuery.$or.push({ groups: { $in: investorGroupIds } })
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const investorsToAdd = await Investor.find(filterQuery);
    const investorFolios = investorsToAdd.map((investor) => new InvestorFolio({
      masterFolio: folio._id,
      investor: investor._id,
      user: investor.user,
      instruments: folio.instruments
    }));
    await InvestorFolio.insertMany(investorFolios);
    await folio.save();
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, data: { folio } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}
