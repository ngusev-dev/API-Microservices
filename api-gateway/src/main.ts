import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  getCorsConfig,
  getValidationPipeConfig,
  initSwaggerConfig,
} from './core/config';
import { GrpcExceptionFilter } from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
  app.useGlobalFilters(new GrpcExceptionFilter());
  app.enableCors(getCorsConfig());

  initSwaggerConfig(app);

  await app.listen(3000);
}
bootstrap();
