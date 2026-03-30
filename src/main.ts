import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app/app.module';
import {
  API_PREFIX,
  DEFAULT_APP_PORT,
} from '@/modules/app/constants/app.constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? DEFAULT_APP_PORT);
}

bootstrap().catch(console.error);
