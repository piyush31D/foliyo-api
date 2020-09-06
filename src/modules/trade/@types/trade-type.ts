export interface IMasterTrade {
  masterFolio: string;
  masterOrders: IMasterOrder[];
  exchange: string;
};

export interface IOrder {
  transactionType: string;
  orderType: string;
  symbol: string;
  expiry: Date;
  strike: string;
  segment: string;
  lotSize: number;
  lots: number;
  quantity: number;
  product: string;
  validity: string;
  price: string;
  triggerPrice: string;
  instrumentType: string;
  squareoff: number;
  stoploss: number;
  trailingStoploss: number;
}

export interface IMasterOrder extends IOrder {
  investors: string[];
  investorsGroups: string[];
}

export interface IInvestorOrder extends IOrder {
  brokerage: string;
  orderId: string;
  status: string;
  tag: string;
}

export interface IInvestorTrade {
  masterTrade: string;
  masterFolio: string;
  investorFolio: string;
  investor: string;
  user: string;
  orders: IInvestorOrder[];
};