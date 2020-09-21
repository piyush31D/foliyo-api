import jsonwebtoken from 'jsonwebtoken';
import { UserDocument } from '../models/user.model';
import { config } from '../../../config';

export const generateToken = (user: UserDocument) => {
  const payload = {
    _id: user._id,
    mobile: user.mobile,
    profiles: user.profiles,
    roles: user.roles,
  };
  const token = jsonwebtoken.sign(payload, config.jwtSecret, {
    expiresIn: '24h'
  });
  return {
    payload,
    token
  }
}