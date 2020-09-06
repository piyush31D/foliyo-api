import mongoose from "mongoose";
import { IInvestorFolio } from '../@types/folio-type';

export type InvestorFolioDocument = mongoose.Document & IInvestorFolio;

const investorFolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  masterFolio: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  investor: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  constituents: [
    {
      name: {
        type: String,
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
      lastPrice: {
        type: Number,
        default: 0
      },
      expiry: Date,
      strike: {
        type: String,
        required: true,
      },
      segment: {
        type: String,
        required: true,
      },
      lotSize: {
        type: Number,
        default: 0
      },
      lots: {
        type: Number,
        default: 0
      },
      quantity: {
        type: Number,
        default: 0
      },
      instrumentType: {
        type: String,
        required: true,
      },
    }
  ],
  trades: []
}, { timestamps: true });


export const InvestorFolio = mongoose.model<InvestorFolioDocument>("InvestorFolio", investorFolioSchema);
