import mongoose from "mongoose";
import { IMasterTrade } from '../@types/trade-type';

export type MasterTradeDocument = mongoose.Document & IMasterTrade;

const masterTradeSchema = new mongoose.Schema({
  masterTrade: {
    type: String,
    required: true
  },
  masterFolio: {
    type: String,
    required: true
  },
  masterOrders: [{
    transactionType: {
      type: String,
      required: true
    },
    orderType: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    expiry: Date,
    strike: {
      type: String,
      required: true
    },
    segment: {
      type: String,
      required: true
    },
    lotSize: {
      type: Number,
      required: true,
      default: 0
    },
    lots: {
      type: Number,
      required: true,
      default: 0
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    product: {
      type: String,
      required: true
    },
    validity: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    triggerPrice: {
      type: String,
      required: true
    },
    instrumentType: {
      type: String,
      required: true
    },
    squareoff: {
      type: Number,
      required: true,
      default: 0
    },
    stoploss: {
      type: Number,
      required: true,
      default: 0
    },
    trailingStoploss: {
      type: Number,
      required: true,
      default: 0
    },
    investors: [{
      type: mongoose.Types.ObjectId,
    }],
    investorsGroups: [{
      type: mongoose.Types.ObjectId,
    }],
  }]
}, { timestamps: true });


export const MasterTrade = mongoose.model<MasterTradeDocument>("MasterTrade", masterTradeSchema);
