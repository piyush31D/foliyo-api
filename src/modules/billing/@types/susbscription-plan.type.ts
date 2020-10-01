import mongoose from 'mongoose';
export interface ISubscriptionPlan {
  advisor: string;
  user: string;
  name: string;
  planType: string;
  pricings: IPlanPricing[];
  promotions: IPromotion[];
  minimumInvestment: number;
  supportedProducts: string[];
  features: string[];
  backgroundColor: string;
  subscribers: mongoose.Types.ObjectId[];
  prviousSubscribers: mongoose.Types.ObjectId[];
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