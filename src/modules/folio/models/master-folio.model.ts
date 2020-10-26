import mongoose from "mongoose";
import { IMasterFolio } from '../@types/folio-type';

export type MasterFolioDocument = mongoose.Document & IMasterFolio;

const masterFolioSchema = new mongoose.Schema({
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
  investorsGroups: [{
    type: mongoose.Types.ObjectId,
    ref: 'InvestorGroup'
  }],
  exchange: {
    type: String,
    required: true,
    default: "NSE"
  },
  instruments: [
    {
      instrument: {
        type: mongoose.Types.ObjectId,
        ref: 'Instrument'
      },
      lots: {
        type: Number,
        default: 0
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  masterTrades: []
}, { timestamps: true });

masterFolioSchema.index({ "instruments.symbol": 1 }, { unique: true });

export const MasterFolio = mongoose.model<MasterFolioDocument>("MasterFolio", masterFolioSchema);
