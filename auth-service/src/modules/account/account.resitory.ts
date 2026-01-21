import { Injectable } from '@nestjs/common';
import type { Account, PendingContactChange } from 'prisma/generated/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: { id },
    });
  }

  async findPendingChange(
    accountId: string,
    type: 'email' | 'phone',
  ): Promise<PendingContactChange> {
    return await this.prismaService.pendingContactChange.findUnique({
      where: {
        accountId_type: {
          accountId,
          type,
        },
      },
    });
  }

  async upsertPandingChage(data: {
    accountId: string;
    type: 'email' | 'phone';
    value: string;
    codeHash: string;
    expiresAt: Date;
  }): Promise<PendingContactChange> {
    return await this.prismaService.pendingContactChange.upsert({
      where: {
        accountId_type: {
          accountId: data.accountId,
          type: data.type,
        },
      },
      create: data,
      update: data,
    });
  }

  async deletePendingChange(
    accountId: string,
    type: 'email' | 'phone',
  ): Promise<PendingContactChange> {
    return await this.prismaService.pendingContactChange.delete({
      where: {
        accountId_type: {
          accountId,
          type,
        },
      },
    });
  }
}
