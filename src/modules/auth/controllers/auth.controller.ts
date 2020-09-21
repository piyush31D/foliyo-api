import { Request, Response, NextFunction } from "express";
import moment from "moment";
import { User } from '../models/user.model';
import { createValidatePINSchema, userSigninSchema, verifyOTPSchema } from "../validators/auth.validator";
import logger from '../../../winston';
import { generateOtp, isExpired } from '../../../utils/otp';
import { MessageQ, MessageQType } from '../../../mqs/message/message-mq';
import {
  INVALID_OTP,
  INVALID_PIN,
  OTP_EXPIRED,
  OTP_SENT,
  USER_NOT_FOUND
} from '../../../const/auth/auth-error.const';
import { generateToken } from '../utils/auth.util';

export const userSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userSigninSchema.validateAsync(req.body);
    let user = await User.findOne({ mobile: req.body.mobile });
    if (!user) {
      user = new User({
        mobile: req.body.mobile
      });
    }
    if (isExpired(user.otpExpiry)) {
      user.otp = generateOtp();
      user.otpExpiry = moment().add(5, 'minute').toDate();
    }
    await user.save();
    try {
      await MessageQ.add({ type: MessageQType.SEND_OTP, mobile: user.mobile, otp: user.otp })
    } catch (error) {
      logger.error(error.message);
    }
    return res.json({ success: true, message: OTP_SENT });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

export const verifyOTP = async ({ body }: { body: { mobile: string, otp: string } }, res: Response, next: NextFunction) => {
  try {
    await verifyOTPSchema.validateAsync(body);
    const { mobile, otp } = body;
    const user = await User.findOne({ mobile });
    if (!user)
      throw new Error(USER_NOT_FOUND)
    if (isExpired(user.otpExpiry))
      throw new Error(OTP_EXPIRED);
    if (user && user.otp !== otp)
      throw new Error(INVALID_OTP);
    return res.json({
      success: true,
      data: {
        pinExists: !!user.pin
      }
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const setupPIN = async ({ body }: { body: { mobile: string, pin: string } }, res: Response, next: NextFunction) => {
  try {
    await createValidatePINSchema.validateAsync(body);
    const { mobile, pin } = body;
    const user = await User.findOne({ mobile });
    if (!user)
      throw new Error(USER_NOT_FOUND)
    user.pin = pin;
    await user.save();
    const { payload, token } = generateToken(user);
    return res.json({
      success: true,
      token,
      data: payload
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const verifyPIN = async ({ body }: { body: { mobile: string, pin: string } }, res: Response, next: NextFunction) => {
  try {
    await createValidatePINSchema.validateAsync(body);
    const { mobile, pin } = body;
    const user = await User.findOne({ mobile });
    if (!user)
      throw new Error(USER_NOT_FOUND);
    const validPIN = await user.comparePin(pin);
    if (!validPIN) {
      throw new Error(INVALID_PIN)
    }
    const { payload, token } = generateToken(user);
    return res.json({
      success: true,
      token,
      data: payload
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}