import { object, string, number } from 'yup';
import {
  DEFAULT_DB_PORT,
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL,
  DEFAULT_APP_PORT,
  DEFAULT_REFRESH_TOKEN_TTL,
  DEFAULT_ACCESS_TOKEN_TTL,
} from '@/modules/app/constants/app.constants';

export const configSchema = object({
  PORT: number().typeError('PORT must be a number').default(DEFAULT_APP_PORT),
  NODE_ENV: string()
    .oneOf(['development', 'production', 'test'])
    .default('development'),
  DB_HOST: string().required('DB_HOST is required'),
  DB_PORT: number()
    .typeError('DB_PORT must be a number')
    .default(DEFAULT_DB_PORT),
  DB_USERNAME: string().required('DB_USERNAME is required'),
  DB_PASSWORD: string().required('DB_PASSWORD is required'),
  DB_NAME: string().required('DB_NAME is required'),
  RATE_LIMIT_TTL: number()
    .typeError('RATE_LIMIT_TTL must be a number')
    .default(DEFAULT_THROTTLE_TTL),
  RATE_LIMIT_MAX: number()
    .typeError('RATE_LIMIT_MAX must be a number')
    .default(DEFAULT_THROTTLE_LIMIT),
  REDIS_PORT: number().typeError('REDIS_PORT must be a number'),
  REDIS_URL: string().required('REDIS_URL is required'),
  JWT_ACCESS_SECRET: string()
    .optional()
    .typeError('JWT_ACCESS_SECRET must be a string'),
  JWT_ACCESS_EXPIRES_IN: string()
    .optional()
    .typeError('JWT_ACCESS_EXPIRES_IN must be a string')
    .default(DEFAULT_ACCESS_TOKEN_TTL),
  JWT_REFRESH_SECRET: string()
    .optional()
    .typeError('JWT_REFRESH_SECRET must be a string'),
  JWT_REFRESH_EXPIRES_IN: string()
    .optional()
    .typeError('JWT_REFRESH_EXPIRES_IN must be a string')
    .default(DEFAULT_REFRESH_TOKEN_TTL),
});
