import { customAlphabet } from "nanoid";
import moment from 'moment';

export function generateOtp(): string {
  return customAlphabet('0123456789', 6)();
}

export function isExpired(otpExpiry: Date): boolean {
  if (!otpExpiry) return false;
  return moment().isAfter(moment(otpExpiry));
}