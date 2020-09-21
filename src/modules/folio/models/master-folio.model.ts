import mongoose from "mongoose";
import { IMasterFolio } from '../@types/folio-type';

export type MasterFolioDocument = mongoose.Document & IMasterFolio;

const masterFolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  investors: [],
  investorsGroups: [],
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
      investors: [],
      investorsGroups: [],
    }
  ],
  masterTrades: []
}, { timestamps: true });


export const MasterFolio = mongoose.model<MasterFolioDocument>("MasterFolio", masterFolioSchema);
