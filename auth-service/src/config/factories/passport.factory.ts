import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '../interfaces';
import { PassportModuleOptions } from 'passport';

export function getPassportFactory(
  configService: ConfigService<AllConfigs>,
): PassportModuleOptions {
  return {
    secretKey: configService.get('passport.secretKey', { infer: true }),
  };
}
