export interface IMasterFolio {
  name: string;
  investors: string[];
  investorsGroups: string[];
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
  investor: string[];
  user: string;
  constituents: IConstituent[];
  trades: string[];
};