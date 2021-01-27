import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: configService.get('ORIGIN'),
    optionsSuccessStatus: 200,
  });
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

  await app.listen(configService.get('PORT'));
}
bootstrap();
