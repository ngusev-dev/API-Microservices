import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AccountServiceClient,
  ConfirmEmailChangeRequest,
  ConfirmPhoneChangeRequest,
  GetAccountRequest,
  InitEmailChangeRequest,
  InitPhoneChangeRequest,
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

  initEmailChange(request: InitEmailChangeRequest) {
    return this.accountServiceClient.initEmailChange(request);
  }

  confirmEmailChange(request: ConfirmEmailChangeRequest) {
    return this.accountServiceClient.confirmEmailChange(request);
  }

  initPhoneChange(request: InitPhoneChangeRequest) {
    return this.accountServiceClient.initPhoneChange(request);
  }

  confirmPhoneChange(request: ConfirmPhoneChangeRequest) {
    return this.accountServiceClient.confirmPhoneChange(request);
  }
}
