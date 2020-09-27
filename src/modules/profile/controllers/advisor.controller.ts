import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Advisor } from '../models/advisor-profile.model';
import logger from '../../../winston';
import { IAdvisor } from '../@types/advisor-type';
import { createAdvisorSchema } from '../validators/advisor';
import {
  ADVISOR_CREATE_SUCCESS,
  ADVISOR_PROFILE_EXISTS
} from '../../../const/profile/profile-message.const';
import APIError from '../../../error';
import { UserProfile } from '../../auth/@types/user.enum';
import User from '../../auth/models/user.model';

export const getAdvisorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const advisor = await Advisor.findOne({ mobile: req.user._id });
    const data: { profileExists: boolean, profile?: IAdvisor } = { profileExists: false };
    if (advisor) {
      data.profileExists = true;
      data.profile = advisor;
    }
    return res.json({ success: true, data });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const createAdvisorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createAdvisorSchema.validateAsync(req.body);
    const advisor = await Advisor.findOne({ mobile: req.user._id });
    if (advisor)
      throw new APIError(ADVISOR_PROFILE_EXISTS, httpStatus.CONFLICT);
    const newAdvisor = new Advisor(req.body);
    newAdvisor.user = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    await newAdvisor.save();
    await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.user._id), { $push: { profiles: UserProfile.ADVISOR } });
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, data: { profile: newAdvisor }, message: ADVISOR_CREATE_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}