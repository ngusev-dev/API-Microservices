import { ConfigService } from '@nestjs/config';
import { PassportModuleOptions } from 'passport';

export function getPassportFactory(
  configService: ConfigService,
): PassportModuleOptions {
  return {
    secretKey: configService.getOrThrow<string>('PASSPORT_SECRET_KEY'),
  };
}
