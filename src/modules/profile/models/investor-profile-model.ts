import mongoose from "mongoose";
import { IInvestor } from '../@types/investor-type';

export type InvestorDocument = mongoose.Document & IInvestor

const investorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  picture: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  residence: {
    type: String,
    required: true
  },
  occupationDetails: {
    sector: {
      type: String,
      required: true
    },
    salaryRange: {
      type: String,
      required: true
    }
  },
  fathersName: {
    type: String,
    required: true
  },
  mothersName: {
    type: String,
    required: true
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
