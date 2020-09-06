import mongoose from "mongoose";
import { ISubscription } from '../@types/susbscription-type';

export type SubscriptionDocument = mongoose.Document & ISubscription;

const subscriptionSchema = new mongoose.Schema({
  advisor: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  planInterval: {
    type: String,
    required: true,
  },
  promotions: [{
    code: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    validity: Date
  }],
  minimumInvestment: {
    type: String,
    required: true,
  },
  supportedProducts: []
}, { timestamps: true });


export const Subscription = mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);
