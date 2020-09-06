import mongoose from "mongoose";
import { IBankAccount } from '../@types/bank-account-type';

export type BankAccountDocument = mongoose.Document & IBankAccount

const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true
  },
  IFSC: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  accountNumber: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


export const BankAccount = mongoose.model<BankAccountDocument>("BankAccount", bankAccountSchema);
