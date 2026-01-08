import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import type { SendOtpRequest, SendOtpResponse } from 'contracts/gen/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SendOtp')
  async SendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return await this.authService.sendOtp(data);
  }
}
