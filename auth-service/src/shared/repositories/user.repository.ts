import { Injectable } from '@nestjs/common';
import type { Account } from 'prisma/generated/client';
import type { AccountUpdateInput } from 'prisma/generated/models';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPhone(phone: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: {
        phone,
      },
    });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, data: AccountUpdateInput) {
    return await this.prismaService.account.update({
      where: {
        id,
      },
      data,
    });
  }
}
