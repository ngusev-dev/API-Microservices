import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'common';
import { createHash } from 'node:crypto';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class OtpService {
  private _redisOtpKey = (
    indentifier: string,
    type: 'phone' | 'email',
  ): string => `otp:${type}:${indentifier}`;

  constructor(private readonly redisService: RedisService) {}

  async send(
    indentifier: string,
    type: 'phone' | 'email',
  ): Promise<{ code: number; hash: string }> {
    const { code, hash } = this.generateCode();

    await this.redisService.set(
      this._redisOtpKey(indentifier, type),
      hash,
      'EX',
      300,
    );

    return { code, hash };
  }

  async verify(indentifier: string, code: string, type: 'phone' | 'email') {
    const redisKey = this._redisOtpKey(indentifier, type);
    const storedHash = await this.redisService.get(redisKey);

    if (!storedHash)
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        details: 'Invalid or expired OTP code',
      });

    const incamingHash = createHash('sha256').update(code).digest('hex');

    if (storedHash !== incamingHash)
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        details: 'Invalid OTP code',
      });

    await this.redisService.del(redisKey);
  }

  private generateCode() {
    const code = Math.floor(10000 + Math.random() * 9000);
    const hash = createHash('sha256').update(code.toString()).digest('hex');

    return { code, hash };
  }
}
