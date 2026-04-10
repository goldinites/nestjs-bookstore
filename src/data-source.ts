import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DEFAULT_DB_PORT } from '@/modules/app/constants/app.constants';
import { ensureNonEmpty } from '@/modules/utils/ensure-non-empty';

dotenvConfig();

const port = Number(process.env.DB_PORT);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ensureNonEmpty(process.env.DB_HOST, 'DB_HOST'),
  port: Number.isFinite(port) && port > 0 ? port : DEFAULT_DB_PORT,
  username: ensureNonEmpty(process.env.DB_USERNAME, 'DB_USERNAME'),
  password: ensureNonEmpty(process.env.DB_PASSWORD, 'DB_PASSWORD'),
  database: ensureNonEmpty(process.env.DB_NAME, 'DB_NAME'),
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
