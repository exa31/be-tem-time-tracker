import { HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(
      {
        success: false,
        data: null,
        timestamp: new Date(),
        message,
      },
      404, // HTTP status code for Not Found
    );
  }
}

