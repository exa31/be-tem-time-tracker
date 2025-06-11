import { HttpException } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(
      {
        success: false,
        data: null,
        timestamp: new Date(),
        message,
      },
      403,
    );
  }
}

