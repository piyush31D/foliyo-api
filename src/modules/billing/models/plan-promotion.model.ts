import mongoose from "mongoose";
import { IPlanPromotion } from '../@types/susbscription-plan.type';

export type PlanPromotionDocument = mongoose.Document & IPlanPromotion;

const planPromotionSchema = new mongoose.Schema({
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
  name: String,
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
  startDate: Date,
  expiryDate: Date,
  maxDiscount: Number,
  subscriptionPlans: [{
    type: mongoose.Types.ObjectId,
    ref: 'SubscriptionPlan'
  }],
}, { timestamps: true });


export const PlanPromotion = mongoose.model<PlanPromotionDocument>("PlanPromotion", planPromotionSchema);
