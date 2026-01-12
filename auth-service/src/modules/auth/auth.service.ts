import { Injectable } from '@nestjs/common';
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from 'contracts/gen/auth';
import { AuthRepository } from './auth.repository';
import type { Account } from 'prisma/generated/client';
import { OtpService } from '../otp/otp.service';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'common';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
  ) {}

  public async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const { identifier, type } = data;

    let account: Account | null = null;

    if (type === 'phone')
      account = await this.authRepository.findByPhone(identifier);
    else if (type === 'email')
      account = await this.authRepository.findByEmail(identifier);

    if (!account) {
      account = await this.authRepository.createAccount({
        email: type === 'email' ? identifier : undefined,
        phone: type === 'phone' ? identifier : undefined,
      });
    }

    const code = await this.otpService.send(
      identifier,
      type as 'phone' | 'email',
    );

    console.debug(code);

    return { ok: true };
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const { identifier, type, code } = data;

    await this.otpService.verify(identifier, code, type as 'phone' | 'email');

    let account: Account | null = null;

    if (type === 'phone')
      account = await this.authRepository.findByPhone(identifier);
    else if (type === 'email')
      account = await this.authRepository.findByEmail(identifier);

    if (!account)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Account not found',
      });

    if (type === 'phone' && !account.isPhoneVerified)
      await this.authRepository.update(account.id, {
        isPhoneVerified: true,
      });

    if (type === 'email' && !account.isEmailVerified)
      await this.authRepository.update(account.id, {
        isPhoneVerified: true,
      });

    return {
      accessToken: '123456',
      refreshToken: '123456',
    };
  }
}
