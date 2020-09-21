import Queue from "bull";
import MSG91 from 'msg91';
import Bluebird from 'bluebird';
import { config } from '../../config';
import logger from "../../winston";
const msg91 = new MSG91(config.msg91.authKey, config.msg91.senderId, config.msg91.route);
const sendMessage = Bluebird.promisify(msg91.send);

export const MessageQ = new Queue("MessageQ", { redis: config.redis });

export enum MessageQType {
  SEND_OTP = 'SEND_OTP'
};

MessageQ.isReady().then(() => {
  MessageQ.process(async ({ data }: { data: { type: MessageQType, mobile: string, otp?: string } }) => {
    try {
      switch (data.type) {
        case MessageQType.SEND_OTP:
          await sendMessage(data.mobile, `${data.otp} is your one time password.`);
      }
      return Promise.resolve();
    } catch (error) {
      logger.error(error.message)
      return Promise.resolve()
    }
  });
}).catch((err: Error) => {
  logger.error(err.message);
});

MessageQ.on('completed', ({ id }) => {
  logger.info(`job ${id} complete`)
});
MessageQ.on('error', (err: Error) => {
  logger.error(err.message)
});