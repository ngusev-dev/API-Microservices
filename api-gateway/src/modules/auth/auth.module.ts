import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientGrpc } from './auth.grpc';
import { PROTO_PATHS } from 'contracts';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            protoPath: PROTO_PATHS.AUTH,
            url: 'localhost:50051',
          },
        }),
      },
    ]),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
