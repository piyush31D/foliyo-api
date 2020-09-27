import { Request, Response, NextFunction } from "express";
import { Advisor } from '../models/advisor-profile.model';
import logger from '../../../winston';

import { IAdvisor } from '../@types/advisor-type';

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