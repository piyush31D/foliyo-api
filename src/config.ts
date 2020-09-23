import Joi from '@hapi/joi';
import { Environment } from './@types/enum';

// define validation for all the env vars
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(Environment.Development, Environment.Production, Environment.Testing, Environment.Staging)
    .default(Environment.Development),
  PORT: Joi.number()
    .default(4000),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.string().default('jwtsecret'),
      otherwise: Joi.string().required()
        .description('JWT Secret required to sign')
    }),
  JWT_PIN_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.string().default('jwtpinsecret'),
      otherwise: Joi.string().required()
        .description('JWT Secret required to sign')
    }),
  MONGO_URI: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.string().default('mongodb://localhost:27017/protofolio'),
      otherwise: Joi.string().required()
        .description('Mongo DB host url')
    }),
  REDIS_HOST: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.string().default('localhost'),
      otherwise: Joi.string().required()
        .description('Redis DB host url')
    }),
  REDIS_PORT: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.number().default(6379),
      otherwise: Joi.number().required()
        .description('Rdis DB port')
    }),
  REDIS_PASSWORD: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.string().default(''),
      otherwise: Joi.string().required()
        .description('Redis DB password')
    }),
  REDIS_DB: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string().equal(Environment.Development),
      then: Joi.number().default(10),
      otherwise: Joi.number().required()
        .description('Redis DB name')
    }),
  MSG91_AUTHKEY: Joi.string()
    .required(),
  MSG91_SENDERID: Joi.string()
    .default('FOLIYO'),
  MSG91_ROUTE: Joi.string()
    .default('4')

}).unknown().required();

const { error, value: env } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongooseDebug: env.MONGOOSE_DEBUG,
  jwtSecret: env.JWT_SECRET,
  jwtPinSecret: env.JWT_PIN_SECRET,
  mongoUri: env.MONGO_URI,
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
  },
  msg91: {
    authKey: env.MSG91_AUTHKEY,
    senderId: env.MSG91_SENDERID,
    route: env.MSG91_ROUTE
  }
};
