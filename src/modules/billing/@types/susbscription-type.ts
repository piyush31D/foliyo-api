export interface ISubscription {
  advisor: string;
  user: string;
  name: string;
  planType: string;
  amount: string;
  planInterval: string;
  promotions: IPromotion[];
  minimumInvestment: string;
  supportedProducts: string[];
};

export interface IPromotion {
  code: string;
  discountType: string;
  amount: string;
  description: string;
  validity: Date;
}