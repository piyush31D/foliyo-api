import mongoose from 'mongoose';
export interface ISubscriptionPlan {
  advisor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  promotions: mongoose.Types.ObjectId[];
  planType: string;
  pricings: IPlanPricing[];
  minimumInvestment: number;
  supportedProducts: string[];
  features: string[];
  backgroundColor: string;
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

export enum SubscriptionType {
  ONETIME = "ONETIME",
  RECURRING = "RECURRING"
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED"
}

export interface IInvestorSubscription {
  investor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  advisor: mongoose.Types.ObjectId;
  subscriptionPlan: mongoose.Types.ObjectId;
  subscriptionType: SubscriptionType;
  subscriptionStatus: SubscriptionStatus;
  pricing: IPlanPricing;
  subscriptionDate: Date;
  nextPaymentDate: Date;
  lastPaymentDetails: ISubscriptionPayment;
  paymentDetails: ISubscriptionPayment[];
  promotion?: mongoose.Types.ObjectId;
}

export interface ISubscriptionPayment {
  amount: number
}