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
  OTP_VERIFICATION_REQUIRED,
  USER_NOT_FOUND
} from '../../../const/auth/auth-message.const';
import { generatePinToken, generateToken, validatePinToken } from '../utils/auth.util';
import APIError from '../../../error';
import httpStatus from 'http-status';

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
      throw new APIError(USER_NOT_FOUND, httpStatus.NOT_FOUND)
    if (isExpired(user.otpExpiry))
      throw new APIError(OTP_EXPIRED, httpStatus.BAD_REQUEST);
    if (user && user.otp !== otp)
      throw new APIError(INVALID_OTP, httpStatus.BAD_REQUEST);
    user.lastOtpValidation = new Date();
    const pinToken = generatePinToken(user);
    await user.save();
    return res.json({
      success: true,
      data: {
        pinExists: !!user.pin,
        pinToken
      }
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const setupPIN = async ({ body }: { body: { mobile: string, pin: string, pinToken: string } }, res: Response, next: NextFunction) => {
  try {
    await createValidatePINSchema.validateAsync(body);
    const { mobile, pin, pinToken } = body;
    try {
      validatePinToken(pinToken);
    } catch {
      throw new APIError(OTP_VERIFICATION_REQUIRED, httpStatus.FORBIDDEN);
    }
    const user = await User.findOne({ mobile });
    if (!user)
      throw new APIError(USER_NOT_FOUND, httpStatus.NOT_FOUND);
    user.pin = pin;
    user.lastSignIn = new Date();
    await user.save();
    const { payload, token } = generateToken(user);
    return res.json({
      success: true,
      data: {
        user: payload,
        token
      }
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const verifyPIN = async ({ body }: { body: { mobile: string, pin: string, pinToken: string } }, res: Response, next: NextFunction) => {
  try {
    await createValidatePINSchema.validateAsync(body);
    const { mobile, pin, pinToken } = body;
    try {
      validatePinToken(pinToken);
    } catch {
      throw new APIError(OTP_VERIFICATION_REQUIRED, httpStatus.FORBIDDEN);
    }
    const user = await User.findOne({ mobile });
    if (!user)
      throw new APIError(USER_NOT_FOUND, httpStatus.NOT_FOUND);
    const validPIN = await user.comparePin(pin);
    if (!validPIN) {
      throw new APIError(INVALID_PIN, httpStatus.BAD_REQUEST)
    }
    user.lastSignIn = new Date();
    await user.save();
    const { payload, token } = generateToken(user);
    return res.json({
      success: true,
      data: {
        user: payload,
        token
      }
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}