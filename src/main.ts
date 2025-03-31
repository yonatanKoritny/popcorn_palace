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
        const messages = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints || {});
          return {
            field: error.property,
            errors: constraints,
          };
        });
        return {
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        };
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
