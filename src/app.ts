import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import expressjwt from 'express-jwt';
import glob from 'glob';
import { MongoError } from 'mongodb';
import logger from './winston';
import { config } from './config';
import { APIError } from './error';
import { createMongoConnection } from './mongoose';
import { Environment } from './@types/enum';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors()); //TODO: Configure it properly

app.use(expressjwt({ secret: config.jwtSecret, algorithms: ['HS256'] })
  .unless({
    path: [
      '/api/auth/user',
      '/api/auth/otp',
      '/api/auth/pin'
    ]
  }));

// enable detailed API logging in dev env
if (config.env === Environment.Development) {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorize: true
  }));
}

(async () => {
  try {
    // Connect mongodb database
    await createMongoConnection();

    // Start server
    app.listen(config.port, () => {
      logger.info(`server started on port ${config.port} (${config.env})`);

      // Require all the routes
      const routes = glob.sync(`${__dirname}/modules/**/routes/*`);
      routes.forEach((route) => {
        require(route)(app);
      });

      // Require all the models
      const models = glob.sync(`${__dirname}/modules/**/models/*`);
      models.forEach((model) => {
        require(model);
      });

      // Require all the message queues
      const mqs = glob.sync(`${__dirname}/mqs/**/*`, { nodir: true });
      mqs.forEach((mq) => {
        require(mq);
      });

      // if error is not an instanceOf APIError, convert it.
      app.use((err: Error | APIError | MongoError, _req: Request, res: Response, next: NextFunction) => {
        if (err.name === 'UnauthorizedError') {
          return res.status(401).json({ success: false, message: 'Unauthorized request' });
        }
        if (err instanceof APIError) {
          return res.status(err.status).json({ success: false, message: err.message });
        }
        if (err instanceof MongoError) {
          return next(new APIError(err.errmsg, httpStatus.INTERNAL_SERVER_ERROR));
        }
        return next(new APIError(err.message, httpStatus.BAD_REQUEST));
      });

      // catch 404 and forward to error handler
      app.use((_req: Request, _res: Response, next: NextFunction) => {
        const err = new APIError('API not found', httpStatus.NOT_FOUND);
        return next(err);
      });

      // error handler, send stacktrace only during development
      app.use((err: APIError, _req: Request, res: Response, _next: NextFunction) => {
        return res.status(err.status).json({
          success: false,
          message: err.message,
          ...(config.env === Environment.Development && { statck: err.stack })
        })
      });

    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})()

export default app;
