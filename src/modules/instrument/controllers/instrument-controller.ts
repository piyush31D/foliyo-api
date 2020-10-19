import { Request, Response, NextFunction } from "express";
import logger from '../../../winston';
import { Instrument } from '../models/instrument.model';

export const getInstruments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    const query = new RegExp(`^${q}`, 'i');
    const instruments = await Instrument.find({
      $or: [
        { name: query },
        { symbol: query },
        { instrumentToken: query }
      ]
    }).limit(10);
    return res.json({ success: true, data: { instruments } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};