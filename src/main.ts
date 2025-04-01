import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const firstErrorMessage: string =
          Object.values(validationErrors[0].constraints || {})[0] ||
          'Validation failed';
        return {
          statusCode: 400,
          message: firstErrorMessage,
        };
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
