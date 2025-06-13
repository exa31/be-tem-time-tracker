import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MyLogger } from '../lib/logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    const { method, originalUrl, headers, body } = req;

    // Saat response selesai
    res.on('finish', () => {
      const duration = Date.now() - startTime;

      if (res.statusCode >= 500) {
        this.logger.error(`${method} ${res.statusCode} ${originalUrl}`);
      } else if (res.statusCode >= 400) {
        this.logger.warn(`${method} ${res.statusCode} ${originalUrl}`);
      } else {
        this.logger.log(`${method} ${res.statusCode} ${originalUrl}`);
      }
    });

    next();
  }
}
