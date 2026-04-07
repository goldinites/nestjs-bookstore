import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DEFAULT_DB_PORT } from '@/modules/app/constants/app.constants';
import { ensureNonEmpty } from '@/modules/utils/ensure-non-empty';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const port = Number(process.env.DB_PORT);

  return {
    type: 'postgres',
    host: ensureNonEmpty(process.env.DB_HOST, 'DB_HOST'),
    port: Number.isFinite(port) && port > 0 ? port : DEFAULT_DB_PORT,
    username: ensureNonEmpty(process.env.DB_USERNAME, 'DB_USERNAME'),
    password: ensureNonEmpty(process.env.DB_PASSWORD, 'DB_PASSWORD'),
    database: ensureNonEmpty(process.env.DB_NAME, 'DB_NAME'),
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  };
});
