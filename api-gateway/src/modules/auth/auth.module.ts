import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientGrpc } from './auth.grpc';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            protoPath: 'node_modules/contracts/proto/auth.proto',
            url: 'localhost:50051',
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
