import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import { UserDocument } from '../models/user.model';
import { config } from '../../../config';

export const generateToken = (user: UserDocument) => {
  const payload = {
    _id: user._id,
    mobile: user.mobile,
    profiles: user.profiles,
    roles: user.roles,
    lastSignIn: user.lastSignIn,
    lastOtpValidation: user.lastOtpValidation
  };
  const token = jsonwebtoken.sign(payload, config.jwtSecret, {
    expiresIn: moment().endOf('D').add(5, 'hours').unix() - moment().unix()
  });
  return {
    payload,
    token
  }
}

export const generatePinToken = (user: UserDocument) => {
  const payload = {
    mobile: user.mobile,
    lastOtpValidation: user.lastOtpValidation
  };
  const expiresIn = moment().endOf('D').add(15, 'days').add(5, 'hours').unix() - moment().unix();
  console.log(expiresIn)
  return jsonwebtoken.sign(payload, config.jwtPinSecret, {
    expiresIn
  });
}


export const validatePinToken = (token: string) => {
  try {
    return jsonwebtoken.verify(token, config.jwtPinSecret);
  } catch (err) {
    throw err;
  }
}