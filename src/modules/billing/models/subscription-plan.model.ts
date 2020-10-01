import mongoose from "mongoose";
import { ACCENT_COLOR } from '../../../const/theme/color';
import { ISubscriptionPlan } from '../@types/susbscription-plan.type';

export type SubscriptionPlanDocument = mongoose.Document & ISubscriptionPlan;

const subscriptionPlanSchema = new mongoose.Schema({
  advisor: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Advisor'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
    required: true,
  },
  pricings: [{
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
  }],
  promotions: [{
    code: {
      type: String
    },
    discountType: {
      type: String
    },
    autoApply: Boolean,
    planIntervals: String,
    amount: Number,
    percentage: Number,
    description: {
      type: String
    },
    expiry: Date,
    maxDiscount: Number
  }],
  minimumInvestment: {
    type: String,
    required: true,
  },
  supportedProducts: [],
  subscribers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Investor'
  }],
  prviousSubscribers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Investor'
  }],
  features: [String],
  backgroundColor: {
    type: String,
    default: ACCENT_COLOR
  }
}, { timestamps: true });


export const SubscriptionPlan = mongoose.model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
