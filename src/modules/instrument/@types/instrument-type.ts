export interface IInstrument {
  exchangeToken: string;
  name: string;
  symbol: string;
  lastPrice: number;
  expiry: Date;
  strike: string;
  tickSize: number;
  lotSize: number;
  instrumentType: string;
  segment: string;
  exchange: string;
};