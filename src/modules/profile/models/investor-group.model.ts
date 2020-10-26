import mongoose from "mongoose";
import { IInvestorGroup } from '../@types/investor-type';

export type InvestorGroupDocument = mongoose.Document & IInvestorGroup

const investorGroupSchema = new mongoose.Schema({
  advisor: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Advisor'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  investors: [{
    type: mongoose.Types.ObjectId,
    ref: 'Investor'
  }],
  automatic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

investorGroupSchema.index({ investors: 1 }, { unique: true });

export const InvestorGroup = mongoose.model<InvestorGroupDocument>("InvestorGroup", investorGroupSchema);
