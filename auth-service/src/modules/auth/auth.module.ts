import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { OtpService } from '../otp/otp.service';
import { PassportModule } from 'passport';
import { ConfigService } from '@nestjs/config';
import { getPassportFactory } from 'src/config';

@Module({
  imports: [
    PassportModule.forRootAsync({
      useFactory: getPassportFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, OtpService],
})
export class AuthModule {}
