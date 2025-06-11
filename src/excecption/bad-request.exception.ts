import { HttpException } from '@nestjs/common';

export class BadRequestException<T> extends HttpException {
  constructor(message: string = 'Bad Request', data?: T) {
    super(
      {
        success: false,
        data: data,
        timestamp: new Date(),
        message,
      },
      400, // HTTP status code for Bad Request
    );
  }
}
