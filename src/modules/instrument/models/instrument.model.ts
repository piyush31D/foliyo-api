import mongoose from "mongoose";
import { IInstrument } from '../@types/instrument-type';


export type InstrumentDocument = mongoose.Document & IInstrument

const instrumentSchema = new mongoose.Schema({
  exchangeToken: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  symbol: {
    type: String,
    unique: true,
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


export const Auth = mongoose.model<InstrumentDocument>("Instrument", instrumentSchema);
