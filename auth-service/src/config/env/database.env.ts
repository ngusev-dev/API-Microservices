import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/shared';
import { DatabaseValidator } from '../validators';
import type { DatabaseConfig } from '../interfaces/database.interface';

export const databaseEnv = registerAs<DatabaseConfig>('database', () => {
  validateEnv(process.env, DatabaseValidator);

  return {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    name: process.env.DATABASE_NAME,
  };
});
