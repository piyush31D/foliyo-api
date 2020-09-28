export interface ISubscriptionPlan {
  advisor: string;
  user: string;
  name: string;
  planType: string;
  pricings: IPlanPricing[];
  promotions: IPromotion[];
  minimumInvestment: number;
  supportedProducts: string[];
};

export interface IPlanPricing {
  amount: number;
  percentage: number;
  planInterval: PlanInterval;
}

export interface IPromotion {
  code: string;
  discountType: string;
  autoApply: boolean;
  planIntervals: PlanInterval[];
  amount: number;
  percentage: number;
  description: string;
  expiry: Date;
  maxDiscount: number;
}

export enum PlanInterval {
  WEEKLY = "WEEKLY",
  FORTNIGHTLY = "FORTNIGHTLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}