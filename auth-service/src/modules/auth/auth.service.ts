import { Injectable } from '@nestjs/common';
import type {
  RefreshRequest,
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
import { PassportService } from 'passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigs } from 'src/config';
import { UserRepository } from 'src/shared/repositories';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_TTL: number;
  private readonly REFRESH_TOKEN_TTL: number;

  constructor(
    private readonly configService: ConfigService<AllConfigs>,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly passportService: PassportService,
  ) {
    this.ACCESS_TOKEN_TTL = configService.get('passport.ttlAccess', {
      infer: true,
    });
    this.REFRESH_TOKEN_TTL = configService.get('passport.ttlRefresh', {
      infer: true,
    });
  }

  public async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const { identifier, type } = data;

    let account: Account | null = null;

    if (type === 'phone')
      account = await this.userRepository.findByPhone(identifier);
    else if (type === 'email')
      account = await this.userRepository.findByEmail(identifier);

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
      account = await this.userRepository.findByPhone(identifier);
    else if (type === 'email')
      account = await this.userRepository.findByEmail(identifier);

    if (!account)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Account not found',
      });

    if (type === 'phone' && !account.isPhoneVerified)
      await this.userRepository.update(account.id, {
        isPhoneVerified: true,
      });

    if (type === 'email' && !account.isEmailVerified)
      await this.userRepository.update(account.id, {
        isPhoneVerified: true,
      });

    return this.generateTokens(account.id);
  }

  refresh(data: RefreshRequest) {
    const { refreshToken } = data;

    const result = this.passportService.verify(refreshToken);

    if (!result.valid) {
      throw new RpcException({
        code: RpcStatus.UNAUTHENTICATED,
        details: result.reason,
      });
    }

    return this.generateTokens(result.userId);
  }

  private generateTokens(userId: string) {
    const accessToken = this.passportService.generate(
      userId,
      this.ACCESS_TOKEN_TTL,
    );
    const refreshToken = this.passportService.generate(
      userId,
      this.REFRESH_TOKEN_TTL,
    );

    return { accessToken, refreshToken };
  }
}
