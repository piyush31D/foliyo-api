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
      }
    }
  ],
  masterTrades: []
}, { timestamps: true });


export const MasterFolio = mongoose.model<MasterFolioDocument>("MasterFolio", masterFolioSchema);
