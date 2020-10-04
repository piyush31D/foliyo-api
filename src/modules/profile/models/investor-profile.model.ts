import mongoose from "mongoose";
import { IInvestor } from '../@types/investor-type';

export type InvestorDocument = mongoose.Document & IInvestor

const investorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  picture: {
    type: String,
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  residence: {
    type: String
  },
  occupationDetails: {
    sector: {
      type: String
    },
    salaryRange: {
      type: String
    }
  },
  fathersName: {
    type: String
  },
  mothersName: {
    type: String
  },
  pan: {
    type: String,
    required: true
  },
  nomineeDetails: [{
    relation: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    }
  }],
  riskAnalysis: []
}, { timestamps: true });


export const Investor = mongoose.model<InvestorDocument>("Investor", investorSchema);
