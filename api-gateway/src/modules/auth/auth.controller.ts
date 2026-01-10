import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VerifyOtpRequest, SendOtpRequest } from './dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthClientGrpc } from './auth.grpc';

@Controller('auth')
export class AuthController {
  constructor(private readonly client: AuthClientGrpc) {}

  @ApiOperation({
    summary: 'Send OTP code',
    description: 'Send OTP code to the user',
  })
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public sendOtp(@Body() dto: SendOtpRequest) {
    return this.client.sendOtp(dto);
  }

  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'Verify user OTP code',
  })
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  public verifyOtp(@Body() dto: VerifyOtpRequest) {
    return this.client.verifyOtp(dto);
  }
}
