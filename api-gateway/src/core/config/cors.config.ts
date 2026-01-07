import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(): CorsOptions {
  return { origin: '*', credentials: true };
}
