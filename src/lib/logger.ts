import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class MyLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      new winston.transports.Console({ format: winston.format.simple() }),
    ];

    // Tambahkan file log hanya jika bukan di Vercel
    if (process.env.VERCEL !== '1') {
      transports.push(
        new winston.transports.File({ filename: 'logs/app.log' }),
      );
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp as string}] ${level.toUpperCase()}: ${message as string}`;
        })
      ),
      transports,
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace ?? ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
