import { Injectable } from '@nestjs/common';
import { Account } from 'prisma/generated/client';
import type { AccountCreateInput } from 'prisma/generated/models';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(data: AccountCreateInput): Promise<Account> {
    return await this.prismaService.account.create({
      data,
    });
  }
}
