import { HttpException } from '@nestjs/common';

export class InternalServerException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(
      {
        success: false,
        data: null,
        timestamp: new Date(),
        message,
      },
      500,
    );
  }
}
