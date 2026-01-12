import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AllConfigs } from 'src/config';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService<AllConfigs>) {
    super({
      username: configService.get('redis.user', { infer: true }),
      password: configService.get('redis.password', { infer: true }),
      host: configService.get('redis.host', { infer: true }),
      port: configService.get('redis.port', { infer: true }),
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  onModuleInit() {
    const start = Date.now();

    this.logger.log('Initializing Redis...');

    this.on('connect', () => {
      this.logger.log(`Redis connecting...`);
    });

    this.on('ready', () => {
      this.logger.log(`Redis connected in ${Date.now() - start}ms`);
    });

    this.on('error', (error) => {
      this.logger.error(`Redis error:`, error);
    });

    this.on('close', () => {
      this.logger.log(`Redis connection closed`);
    });

    this.on('reconnecting', () => {
      this.logger.log(`Redis reconnecting...`);
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis...');

    try {
      await this.quit();
    } catch (error) {
      this.logger.error(`Redis quit error:`, error);
    }
  }
}
