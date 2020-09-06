import { IUser } from '../../auth/@types/user-type';

export interface IChannel {
  channelType: string;
  name?: string;
  activeUsers: string[];
  pastUsers: IChannelUser[];
  messages: IMessage[];
}

export interface IChannelUser {
  user: IUser,
  joiningDate: Date,
  terminationDate: Date
}

export interface IMessage {
  channel: string
  text: string
  user: IUser
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
}