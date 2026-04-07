import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app/app.module';
import {
  API_PREFIX,
  DEFAULT_APP_PORT,
} from '@/modules/app/constants/app.constants';
import { AllExceptionsFilter } from '@/modules/app/filters/all-exceptions.filter';
import { RequestLoggingInterceptor } from '@/modules/app/interceptors/request-logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  const port = Number(process.env.PORT ?? DEFAULT_APP_PORT);

  await app.listen(port, () => {
    Logger.log(`Server is running on port ${port}`, 'Bootstrap');
  });
}

bootstrap().catch((error) => {
  Logger.error(error, 'Bootstrap');
  process.exit(1);
});
