import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/shared';
import { PassportValidator } from '../validators';
import type { PassportConfig } from '../interfaces/passport.interface';

export const passportEnv = registerAs<PassportConfig>('passport', () => {
  validateEnv(process.env, PassportValidator);

  return {
    secretKey: process.env.PASSPORT_SECRET_KEY,
    ttlAccess: parseInt(process.env.PASSPORT_TTL_ACCESS),
    ttlRefresh: parseInt(process.env.PASSPORT_TTL_REFRESH),
  };
});
