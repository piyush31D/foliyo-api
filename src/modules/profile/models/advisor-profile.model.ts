import mongoose from "mongoose";
import { IAdvisor } from '../@types/advisor-type';

export type AdvisorDocument = mongoose.Document & IAdvisor

const advisorSchema = new mongoose.Schema({
  pan: {
    type: String,
  },
  regNumber: {
    type: String,
  },
  authority: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  picture: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  residence: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  offerings: [String],
  rating: Number,
  individualDetails: {
    firstName: String,
    lastName: String,
    gender: String
  },
  companyDetails: {
    name: {
      type: String
    }
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    country: String,
  }]
}, { timestamps: true });


export const Advisor = mongoose.model<AdvisorDocument>("Advisor", advisorSchema);