import { Injectable } from '@nestjs/common';
import type { Account } from 'prisma/generated/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: { id },
    });
  }
}
