import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './lib/logger';
import VarEnv from './config/varEnv';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { BadRequestException } from './excecption/bad-request.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.useLogger(new MyLogger());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          return {
            [error.property]: Object.values(error.constraints || {}).map(
              (message) => message,
            ),
          };
        });
        throw new BadRequestException('Validation failed', ...formattedErrors);
      },
    }),
  );
  await app.listen(VarEnv.port);
}

bootstrap();
