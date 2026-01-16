import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  getCorsConfig,
  getValidationPipeConfig,
  initSwaggerConfig,
} from './core/config';
import { GrpcExceptionFilter } from './shared/filters';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('HTTP_PORT');

  app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
  app.useGlobalFilters(new GrpcExceptionFilter());
  app.enableCors(getCorsConfig(configService));

  initSwaggerConfig(app);

  await app.listen(PORT);
}
bootstrap();
