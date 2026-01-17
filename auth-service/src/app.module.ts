import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { databaseEnv, grpcEnv, passportEnv, redisEnv } from './config';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseEnv, redisEnv, passportEnv, grpcEnv],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    OtpModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
