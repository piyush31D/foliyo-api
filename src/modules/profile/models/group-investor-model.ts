import mongoose from "mongoose";
import { IInvestorGroup } from '../@types/investor-type';

export type InvestorGroupDocument = mongoose.Document & IInvestorGroup

const investorGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  investors: [{
    type: mongoose.Types.ObjectId
  }],
  groupCriterias: [{
    name: {
      type: String,
      required: true,
    },
    values: [String]
  }],
  autoAddition: Boolean
}, { timestamps: true });


export const InvestorGroup = mongoose.model<InvestorGroupDocument>("InvestorGroup", investorGroupSchema);
