import { HttpException } from '@nestjs/common';

export class NotAuthorizeException extends HttpException {
  constructor(message = 'You are not authorized to access this resource') {
    super(
      {
        success: false,
        data: null,
        timestamp: new Date(),
        message,
      },
      401, // HTTP status code for Unauthorized
    );
  }
}

