import { UserProfile } from './user.enum';

export interface IUser {
  email: string;
  mobile: string;
  pin: string;
  otp: string;
  otpExpiry: Date;
  emailVerified: boolean;
  providor: string;
  profiles: UserProfile[];
  roles: string[];
  permissions: string[];
  lastSignIn?: Date;
  lastOtpValidation?: Date;
}