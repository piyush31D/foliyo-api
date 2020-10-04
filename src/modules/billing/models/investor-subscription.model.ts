import mongoose from "mongoose";
import { IInvestorSubscription, SubscriptionStatus, SubscriptionType } from '../@types/susbscription-plan.type';

export type InvestorSubscriptionDocument = mongoose.Document & IInvestorSubscription;

const investorSubscriptionSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Types.ObjectId,
    ref: 'Investor'
  },
  advisor: {
    type: mongoose.Types.ObjectId,
    ref: 'Advisor'
  },
  subscriptionPlan: {
    type: mongoose.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  subscriptionType: {
    type: String,
    default: SubscriptionType.ONETIME,
    enum: Object.values(SubscriptionType)
  },
  subscriptionStatus: {
    type: String,
    default: SubscriptionStatus.ACTIVE,
    enum: Object.values(SubscriptionStatus)
  },
  pricing: {
    planInterval: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true
    }
  },
  subscriptionDate: {
    type: Date,
    default: new Date()
  },
  nextPaymentDate: {
    type: Date
  },
  lastPaymentDetails: {
    amount: Number
  },
  paymentDetails: [{
    amount: Number
  }],
  promotion: {
    type: mongoose.Types.ObjectId,
    ref: 'PlanPromotion'
  },
  deleted: {
    type: Boolean
  }
}, { timestamps: true });


export const InvestorSubscription = mongoose.model<InvestorSubscriptionDocument>("InvestorSubscription", investorSubscriptionSchema);
