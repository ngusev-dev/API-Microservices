import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpRequest } from './dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Send OTP code',
    description: 'Send OTP code to the user',
  })
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public sendOtp(@Body() dto: SendOtpRequest) {
    console.log('DATA:', dto);

    return { ok: true };
  }
}
