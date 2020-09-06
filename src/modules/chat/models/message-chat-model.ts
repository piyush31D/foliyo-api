import mongoose from "mongoose";
import { IMessage } from '../@types/chat-type';

export type ChatMessageDocument = mongoose.Document & IMessage;

const chatMessageSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  audio: {
    type: String,
  },
  system: {
    type: Boolean,
    default: false
  },
  sent: {
    type: Boolean,
    default: false
  },
  received: {
    type: Boolean,
    default: false
  },
  pending: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });


export const ChatMessage = mongoose.model<ChatMessageDocument>("ChatMessage", chatMessageSchema);
