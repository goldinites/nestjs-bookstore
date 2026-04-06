import { registerAs } from '@nestjs/config';
import {
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL,
} from '@/modules/app/constants/app.constants';

export default registerAs('throttler', () => ({
  ttl: Number(process.env.RATE_LIMIT_TTL) || DEFAULT_THROTTLE_TTL,
  limit: Number(process.env.RATE_LIMIT_MAX) || DEFAULT_THROTTLE_LIMIT,
}));
