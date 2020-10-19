import mongoose from "mongoose";
import { IInstrument } from '../@types/instrument-type';

export type InstrumentDocument = mongoose.Document & IInstrument

const instrumentSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'KITE'
  },
  exchangeToken: {
    type: String
  },
  instrumentToken: String,
  name: {
    type: String
  },
  symbol: {
    type: String
  },
  lastPrice: Number,
  expiry: Date,
  strike: String,
  tickSize: Number,
  lotSize: Number,
  instrumentType: String,
  segment: String,
  exchange: String
}, { timestamps: true });

instrumentSchema.index({ exchangeToken: 1, symbol: 1 }, { unique: true });

export const Instrument = mongoose.model<InstrumentDocument>("Instrument", instrumentSchema);
