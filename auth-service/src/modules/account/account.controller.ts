import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import type {
  GetAccountRequest,
  GetAccountResponse,
} from 'contracts/gen/account';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @GrpcMethod('AccountService', 'GetAccount')
  async getAccount(data: GetAccountRequest): Promise<GetAccountResponse> {
    return await this.accountService.getAccount(data);
  }
}
