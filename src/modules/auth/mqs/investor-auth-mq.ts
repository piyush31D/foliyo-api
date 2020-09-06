import Queue from "bull";
import { config } from '../../../config';
import logger from "../../../winston";

export const queue = new Queue("InvestorAuthQ", { redis: config.redis });

queue.isReady().then(() => {
  queue.process(({ data }) => {
    try {
      return Promise.resolve();
    } catch (error) {
      logger.error(error.message)
      return Promise.resolve()
    }
  });
}).catch((err: Error) => {
  logger.error(err.message);
});

queue.on('completed', ({ id }) => {
  logger.info(`Job ${id} complete`)
});
queue.on('error', (err: Error) => {
  logger.error(err.message)
});