import { Request, Response, NextFunction } from "express";
import moment from "moment";
import { User } from "../models/user-model";
import { userCreateSchema } from "../validators/auth-validator";
import logger from '../../../winston';
import { generateOtp, isExpired } from '../../../utils/otp';
import { EUserProfile } from '../@types/user-enum';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userCreateSchema.validateAsync(req.body);
    let user = await User.findOne({ mobile: req.body.mobile });
    if (!user) {
      user = new User({
        mobile: req.body.mobile
      });
    }
    if (user && !user.profiles.includes(EUserProfile.INVESTOR))
      user.profiles.push(EUserProfile.INVESTOR);
    if (isExpired(user.otpExpiry)) {
      user.otp = generateOtp();
      user.otpExpiry = moment().add(10, 'minute').toDate();
    }
    await user.save();
    return res.json({ success: true, message: 'Enter OTP to login' });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};