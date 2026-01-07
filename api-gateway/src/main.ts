import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  getCorsConfig,
  getValidationPipeConfig,
  initSwaggerConfig,
} from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
  app.enableCors(getCorsConfig());

  initSwaggerConfig(app);

  await app.listen(3000);
}
bootstrap();
