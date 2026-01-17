/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  Role,
  type GetAccountRequest,
  type GetAccountResponse,
} from 'contracts/gen/account';
import { AccountRepository } from './account.resitory';
import { RpcException } from '@nestjs/microservices';
import { convertEnum, RpcStatus } from 'common';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

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
}
