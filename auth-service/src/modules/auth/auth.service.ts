import { Injectable } from '@nestjs/common';
import { SendOtpRequest, SendOtpResponse } from 'contracts/gen/auth';
import { AuthRepository } from './auth.repository';
import type { Account } from 'prisma/generated/client';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

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

    return { ok: true };
  }
}
