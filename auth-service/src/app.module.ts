import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { databaseEnv, grpcEnv } from './config';
import { redisEnv } from './config/env/redis.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseEnv, redisEnv, grpcEnv],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    OtpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
