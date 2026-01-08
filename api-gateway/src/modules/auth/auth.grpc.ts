import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, SendOtpRequest } from 'contracts/gen/auth';

@Injectable()
export class AuthClientGrpc implements OnModuleInit {
  private authServiceClient: AuthServiceClient;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  sendOtp(request: SendOtpRequest) {
    return this.authServiceClient.sendOtp(request);
  }
}
