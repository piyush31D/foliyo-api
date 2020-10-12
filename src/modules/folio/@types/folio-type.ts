import mongoose from 'mongoose';
import { IInvestorTrade } from 'src/modules/trade/@types/trade-type';

export interface IMasterFolio {
  advisor: mongoose.Types.ObjectId,
  user: mongoose.Types.ObjectId,
  name: string;
  investors: mongoose.Types.ObjectId[];
  investorGroups: mongoose.Types.ObjectId[];
  constituents: IConstituent[];
  masterTrades: string[];
};

export interface IConstituent {
  name: string;
  symbol: string;
  lastPrice: number;
  expiry: Date;
  strike: string;
  segment: string;
  lotSize: number;
  lots: number;
  quantity: number;
  instrumentType: string;
}

export interface IInvestorFolio {
  name: string;
  masterFolio: string;
  investor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  constituents: IConstituent[];
  trades: IInvestorTrade[];
};