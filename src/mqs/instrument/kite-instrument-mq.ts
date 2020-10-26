import Queue from "bull";
import XLSX from 'xlsx';
import axios from 'axios';
import moment from 'moment';
import { config } from '../../config';
import logger from "../../winston";
import { KITE_ENDPOINTS } from '../../const/endpoint/kite';
import { Instrument } from '../../modules/instrument/models/instrument.model';

axios.defaults.baseURL = config.kite.baseUrl;

export const KiteInstrumentSyncQ = new Queue("KiteInstrumentSyncQ", { redis: config.redis });

interface RawInstrument {
  instrument_token: string;
  exchange_token: string;
  tradingsymbol: string;
  name: string;
  last_price: string;
  expiry: string;
  strike: string;
  tick_size: string;
  lot_size: string;
  instrument_type: string;
  segment: string;
  exchange: string;
}

KiteInstrumentSyncQ.isReady().then(() => {
  KiteInstrumentSyncQ.process(async () => {
    try {
      await KiteInstrumentSyncQ.clean(100000, 'completed');
      logger.info('Kite instrument sync started');
      const { data } = await axios.get(KITE_ENDPOINTS.ALL_INSTRUMENTS, { responseType: 'arraybuffer' });
      const workbook = XLSX.read(
        Buffer.from(data),
        { type: 'buffer', cellDates: true, cellNF: false, cellText: false },
      )
      const promises = [];
      for (let index = 0; index < workbook.SheetNames.length; index++) {
        const SheetName = workbook.SheetNames[index];
        const instruments: RawInstrument[] = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);
        for (let j = 0; j < instruments.length; j++) {
          const instrument = instruments[j];
          try {
            promises.push(await Instrument.findOneAndUpdate({ exchangeToken: instrument.exchange_token, symbol: instrument.tradingsymbol },
              {
                instrumentToken: instrument.instrument_token,
                exchangeToken: instrument.exchange_token,
                name: instrument.name,
                symbol: instrument.tradingsymbol,
                lastPrice: parseInt(instrument.last_price),
                ...(instrument.expiry && { expiry: moment(instrument.expiry).toISOString() }),
                strike: instrument.strike,
                tickSize: parseFloat(instrument.tick_size),
                ...(instrument.lot_size && { lotSize: parseInt(instrument.lot_size) }),
                instrumentType: instrument.instrument_type,
                segment: instrument.segment,
                exchange: instrument.exchange
              }, { upsert: true, useFindAndModify: false }));
          } catch (error) {
            logger.error(error.message);
          }
        }
      }
      await Promise.all(promises);
      logger.info('Kite instrument sync completed');
      return Promise.resolve();
    } catch (error) {
      logger.error(error.message)
      return Promise.resolve()
    }
  });
}).catch((err: Error) => {
  logger.error(err.message);
});

KiteInstrumentSyncQ.on('completed', ({ id }) => {
  logger.info(`job ${id} complete`)
});
KiteInstrumentSyncQ.on('error', (err: Error) => {
  logger.error(err.message)
});

KiteInstrumentSyncQ.add({}, { repeat: { cron: "0 0 8 * * *" }, jobId: "kiteinstrumentsync" });