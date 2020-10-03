import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Investor } from '../models/investor-profile.model';
import { Advisor } from '../models/advisor-profile.model';
import logger from '../../../winston';

import { IInvestor } from '../@types/investor-type';
import { createInvestorSchema } from '../validators/investor';
import {
  INVESTOR_PROFILE_EXISTS,
  INVESTOR_CREATE_SUCCESS
} from '../../../const/profile/profile-message.const';
import APIError from '../../../error';
import { UserProfile } from '../../auth/@types/user.enum';
import User from '../../auth/models/user.model';
import { investorIdParamSchema } from '../../../validators/investor';
import { advisorIdParamSchema } from '../../../validators/advisor';

export const getInvestorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investor = await Investor.findOne({ user: req.user._id });
    const data: { profileExists: boolean, profile?: IInvestor } = { profileExists: false };
    if (investor) {
      data.profileExists = true;
      data.profile = investor;
    }
    return res.json({ success: true, data });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const createInvestorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createInvestorSchema.validateAsync(req.body);
    const investor = await Investor.findOne({ user: req.user._id });
    if (investor)
      throw new APIError(INVESTOR_PROFILE_EXISTS, httpStatus.CONFLICT);
    const newInvestor = new Investor(req.body);
    newInvestor.user = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    await newInvestor.save();
    await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.user._id), { $push: { profiles: UserProfile.INVESTOR } });
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, data: { profile: newInvestor }, message: INVESTOR_CREATE_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

//TODO: Add filters
export const getAdvisors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const advisors = await Advisor.find({});
    return res.json({ success: true, data: { advisors } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const getAdvisor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await investorIdParamSchema.validateAsync(req.params);
    await advisorIdParamSchema.validateAsync(req.params);
    const advisor = await Advisor.findById(mongoose.Types.ObjectId(req.params.advisorId));
    return res.json({ success: true, data: { advisor } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

