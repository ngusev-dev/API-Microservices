import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AccountServiceClient,
  GetAccountRequest,
} from 'contracts/gen/account';

@Injectable()
export class AccountClientGrpc implements OnModuleInit {
  private accountServiceClient: AccountServiceClient;

  constructor(@Inject('ACCOUNT_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.accountServiceClient =
      this.client.getService<AccountServiceClient>('AccountService');
  }

  getAccount(request: GetAccountRequest) {
    return this.accountServiceClient.getAccount(request);
  }
}
