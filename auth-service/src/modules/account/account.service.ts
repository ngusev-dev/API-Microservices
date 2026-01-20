import { Injectable } from '@nestjs/common';
import {
  type GetAccountRequest,
  type GetAccountResponse,
} from 'contracts/gen/account';
import { AccountRepository } from './account.resitory';
import { RpcException } from '@nestjs/microservices';
import { convertEnum, RpcStatus } from 'common';

export enum Role {
  USER = 0,
  ADMIN = 1,
  UNRECOGNIZED = -1,
}

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
