import mongoose from "mongoose";
import { IInvestorTrade } from '../@types/trade-type';

export type InvestorTradeDocument = mongoose.Document & IInvestorTrade;

const investorTradeSchema = new mongoose.Schema({
  masterTrade: {
    type: String,
    required: true
  },
  masterFolio: {
    type: String,
    required: true
  },
  investorFolio: {
    type: String,
    required: true
  },
  investor: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  orders: [{
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
    brokerage: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      required: true
    },
  }]
}, { timestamps: true });


export const InvestorTrade = mongoose.model<InvestorTradeDocument>("InvestorTrade", investorTradeSchema);
