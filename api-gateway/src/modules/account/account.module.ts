import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountClientGrpc } from './account.grpc';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATHS } from 'contracts';
import { AccountController } from './account.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ACCOUNT_PACKAGE',
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: 'account.v1',
            protoPath: PROTO_PATHS.ACCOUNT,
            url: 'localhost:50051',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountClientGrpc],
  exports: [AccountClientGrpc],
})
export class AccountModule {}
