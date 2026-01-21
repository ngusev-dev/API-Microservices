import { Injectable } from '@nestjs/common';
import type {
  InitEmailChangeRequest,
  GetAccountRequest,
  GetAccountResponse,
  InitEmailChangeResponse,
  ConfirmEmailChangeRequest,
  ConfirmEmailChangeResponse,
  ConfirmPhoneChangeRequest,
  ConfirmPhoneChangeResponse,
  InitPhoneChangeResponse,
  InitPhoneChangeRequest,
} from 'contracts/gen/account';
import { AccountRepository } from './account.resitory';
import { RpcException } from '@nestjs/microservices';
import { convertEnum, RpcStatus } from 'common';
import { UserRepository } from 'src/shared/repositories';
import { OtpService } from '../otp/otp.service';

export enum Role {
  USER = 0,
  ADMIN = 1,
  UNRECOGNIZED = -1,
}

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
  ) {}

  async getAccount(data: GetAccountRequest): Promise<GetAccountResponse> {
    const account = await this.accountRepository.findById(data.id);

    if (!account)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Account not found',
      });

    return {
      id: account.id,
      phone: account.phone,
      email: account.email,
      isPhoneVerified: account.isPhoneVerified,
      isEmailVerified: account.isEmailVerified,
      role: convertEnum(Role, account.roles),
    };
  }

  async initEmailChange(
    data: InitEmailChangeRequest,
  ): Promise<InitEmailChangeResponse> {
    const { email, userId } = data;

    const candidate = await this.userRepository.findByEmail(email);

    if (candidate)
      throw new RpcException({
        code: RpcStatus.ALREADY_EXISTS,
        details: 'Email already in use',
      });

    const { code, hash } = await this.otpService.send(email, 'email');

    console.log(code);

    await this.accountRepository.upsertPandingChage({
      accountId: userId,
      type: 'email',
      value: email,
      codeHash: hash,
      expiresAt: new Date(Date.now() + 5 * 50 * 1000),
    });

    return { ok: true };
  }

  async confirmEmailChange(
    data: ConfirmEmailChangeRequest,
  ): Promise<ConfirmEmailChangeResponse> {
    const { email, code, userId } = data;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pending = await this.accountRepository.findPendingChange(
      userId,
      'email',
    );

    if (!pending)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Pending email change not found',
      });

    if (pending.value !== email)
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        details: 'Email does not match pending change',
      });

    if (pending.expiresAt < new Date())
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Email change request expired',
      });

    await this.otpService.verify(pending.value as string, code, 'email');

    await this.userRepository.update(userId, {
      email,
      isEmailVerified: true,
    });

    await this.accountRepository.deletePendingChange(userId, 'email');

    return { ok: true };
  }

  async initPhoneChange(
    data: InitPhoneChangeRequest,
  ): Promise<InitPhoneChangeResponse> {
    const { phone, userId } = data;

    const candidate = await this.userRepository.findByPhone(phone);

    if (candidate)
      throw new RpcException({
        code: RpcStatus.ALREADY_EXISTS,
        details: 'Phone already in use',
      });

    const { code, hash } = await this.otpService.send(phone, 'phone');

    console.log(code);

    await this.accountRepository.upsertPandingChage({
      accountId: userId,
      type: 'phone',
      value: phone,
      codeHash: hash,
      expiresAt: new Date(Date.now() + 5 * 50 * 1000),
    });

    return { ok: true };
  }

  async confirmPhoneChange(
    data: ConfirmPhoneChangeRequest,
  ): Promise<ConfirmPhoneChangeResponse> {
    const { phone, code, userId } = data;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pending = await this.accountRepository.findPendingChange(
      userId,
      'phone',
    );

    if (!pending)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Pending Phone change not found',
      });

    if (pending.value !== phone)
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        details: 'Phone does not match pending change',
      });

    if (pending.expiresAt < new Date())
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Phone change request expired',
      });

    await this.otpService.verify(pending.value as string, code, 'phone');

    await this.userRepository.update(userId, {
      phone,
      isPhoneVerified: true,
    });

    await this.accountRepository.deletePendingChange(userId, 'email');

    return { ok: true };
  }
}
