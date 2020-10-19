export interface IInstrument {
  soruce?: string;
  exchangeToken: string;
  instrumentToken: string;
  name: string;
  symbol: string;
  lastPrice: number;
  expiry: string;
  strike: string;
  tickSize: number;
  lotSize: number;
  instrumentType: string;
  segment: string;
  exchange: string;
};