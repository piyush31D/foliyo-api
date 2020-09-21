import mongoose from "mongoose";
import { IChannel } from '../@types/chat.type';

export type ChatChannelDocument = mongoose.Document & IChannel;

const chatChannelSchema = new mongoose.Schema({
  channelType: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  activeUsers: [{
    type: mongoose.Types.ObjectId
  }],
  pastUsers: [{
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    joiningDate: Date,
    terminationDate: Date
  }],
  messages: [{
    type: mongoose.Types.ObjectId
  }]
}, { timestamps: true });


export const ChatChannel = mongoose.model<ChatChannelDocument>("ChatChannel", chatChannelSchema);
