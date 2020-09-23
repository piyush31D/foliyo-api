import { EUserProfile } from './user.enum';

export interface IUser {
  email: string;
  mobile: string;
  pin: string;
  otp: string;
  otpExpiry: Date;
  emailVerified: boolean;
  providor: string;
  profiles: EUserProfile[];
  roles: string[];
  permissions: string[];
  lastSignIn?: Date;
  lastOtpValidation?: Date;
}