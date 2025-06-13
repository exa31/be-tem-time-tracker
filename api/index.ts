// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { BadRequestException } from '../src/excecption/bad-request.exception';
import * as express from 'express';

const server = express();
let cachedApp: express.Express | null = null;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors({ origin: true });

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

  await app.init();
  return server;
}

// Vercel handler
export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrapServer();
  }
  return cachedApp(req, res);
}
