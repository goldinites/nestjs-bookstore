import { registerAs } from '@nestjs/config';
import {
  DEFAULT_ACCESS_TOKEN_TTL,
  DEFAULT_REFRESH_TOKEN_TTL,
} from '@/modules/app/constants/app.constants';
import { ensureNonEmpty } from '@/modules/utils/ensure-non-empty';

export default registerAs('jwt', () => ({
  access: {
    secret: ensureNonEmpty(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? DEFAULT_ACCESS_TOKEN_TTL,
  },
  refresh: {
    secret: ensureNonEmpty(
      process.env.JWT_REFRESH_SECRET,
      'JWT_REFRESH_SECRET',
    ),
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? DEFAULT_REFRESH_TOKEN_TTL,
  },
}));
