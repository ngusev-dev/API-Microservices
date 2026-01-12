import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/shared';
import { RedisValidator } from '../validators';
import type { RedisConfig } from '../interfaces/redis.interface';

export const redisEnv = registerAs<RedisConfig>('redis', () => {
  validateEnv(process.env, RedisValidator);

  return {
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  };
});
