import { registerAs } from '@nestjs/config';
import {
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL,
} from '@/modules/app/constants/app.constants';

export default registerAs('throttler', () => {
  const ttl = Number(process.env.RATE_LIMIT_TTL);
  const limit = Number(process.env.RATE_LIMIT_MAX);

  return {
    ttl: Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_THROTTLE_TTL,
    limit: Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_THROTTLE_LIMIT,
  };
});
