import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // built-in validationPipe의 exception 처리 방식 변경
      exceptionFactory: (errors: ValidationError[]) => {
        const errorResponse: any = {};
        errors.forEach((error) => {
          errorResponse[error.property] = Object.values(error.constraints)[0];
        });
        return new BadRequestException(errorResponse);
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
