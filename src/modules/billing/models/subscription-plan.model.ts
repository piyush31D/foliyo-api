import mongoose from "mongoose";
import { ACCENT_COLOR } from '../../../const/theme/color';
import { ISubscriptionPlan, PlanInterval } from '../@types/susbscription-plan.type';

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
      enum: Object.values(PlanInterval)
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
    type: mongoose.Types.ObjectId,
    ref: 'PlanPromotion'
  }],
  minimumInvestment: {
    type: Number,
    required: true,
  },
  supportedProducts: [],
  features: [String],
  backgroundColor: {
    type: String,
    default: ACCENT_COLOR
  }
}, { timestamps: true });


export const SubscriptionPlan = mongoose.model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
