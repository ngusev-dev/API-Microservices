import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyOtpRequest, SendOtpRequest } from './dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthClientGrpc } from './auth.grpc';
import type { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly client: AuthClientGrpc,
    private readonly configService: ConfigService,
  ) {}

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
  public async verifyOtp(
    @Body() dto: VerifyOtpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await lastValueFrom(
      this.client.verifyOtp(dto),
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refresh access token using refresh token',
  })
  @Post('otp/refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: string | null =
      (req.cookies?.refreshToken as string) ?? null;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await lastValueFrom(
      this.client.refresh({ refreshToken }),
    );

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @ApiOperation({
    summary: 'Remove refresh token',
    description: 'Clear refresh token cookie and logout user from system',
  })
  @Post('otp/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      expires: new Date(0),
    });

    return { ok: true };
  }
}
