import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IUser } from '../@types/user.type';
import { EUserProfile } from '../@types/user.enum';

export type UserDocument = mongoose.Document & IUser & {
  comparePin: comparePinFunction;
};

type comparePinFunction = (pin: string) => Promise<boolean>;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  mobile: {
    type: String,
    unique: true
  },
  pin: String,
  otp: String,
  otpExpiry: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  picture: String,
  providor: {
    type: String,
    default: 'LOCAL'
  },
  profiles: {
    type: [String],
    enum: [EUserProfile.ADVISOR, EUserProfile.INVESTOR]
  },
  roles: {
    type: [String],
    default: ['ADMIN'],
    enum: ['ADMIN']
  },
  permissions: {
    type: [String],
    default: []
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this as UserDocument;
  if (!user.isModified("pin")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.pin, salt, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.pin = hash;
      return next();
    });
  });
});

const comparePin: comparePinFunction = function (pin) {
  const user = this as UserDocument;
  return bcrypt.compare(pin, user.pin);
};

userSchema.methods.comparePin = comparePin;

export const User = mongoose.model<UserDocument>("User", userSchema);
export default User;