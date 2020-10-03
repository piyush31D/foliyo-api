import mongoose from 'mongoose';
export interface ISubscriptionPlan {
  advisor: string;
  user: string;
  name: string;
  promotions: mongoose.Types.ObjectId[];
  planType: string;
  pricings: IPlanPricing[];
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

export interface IPlanPromotion {
  code: string;
  discountType: string;
  autoApply: boolean;
  subscriptionPlans: mongoose.Types.ObjectId[];
  planIntervals: PlanInterval[];
  amount: number;
  percentage: number;
  description: string;
  startDate: Date;
  expiryDate: Date;
  maxDiscount: number;
}

export enum PlanInterval {
  WEEKLY = "WEEKLY",
  FORTNIGHTLY = "FORTNIGHTLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}