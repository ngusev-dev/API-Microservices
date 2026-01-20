import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import { AccountClientGrpc } from 'src/modules/account/account.grpc';
import { ROLES_KEY } from '../decorators';
import { Request } from 'express';
import type { Role } from 'contracts/gen/account';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accountClient: AccountClientGrpc,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || !required.length) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not found');

    const account = await lastValueFrom(
      this.accountClient.getAccount({ id: user.id as string }),
    );

    if (!account) throw new NotFoundException('Account not found');

    if (!required.includes(account.role))
      throw new ForbiddenException('User role not allowed');

    return true;
  }
}
