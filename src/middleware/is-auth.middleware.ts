import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Helper from '../helper';
import VarEnv from '../config/varEnv';
import { NotAuthorizeException } from '../excecption/not-authorize.exception';
import { PayloadJWT } from '../type';
import { MyLogger } from '../lib/logger';

@Injectable()
export class IsAuth implements NestMiddleware {
  constructor(private logger: MyLogger) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = Helper.getToken(req);
    if (!token) {
      throw new NotAuthorizeException(
        'You are not authorized to access this resource. Please login first.',
      );
    }
    try {
      const payload: string | PayloadJWT = jwt.verify(
        token,
        VarEnv.secret_jwt as string,
      ) as PayloadJWT | string;
      if (typeof payload === 'string') {
        throw new NotAuthorizeException(
          'Invalid token format. Please login again.',
        );
      }
      // (Optional) Simpan payload ke request untuk akses nanti
      req.id_user = payload.id_user;
      return next();
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      throw new NotAuthorizeException(
        'You are not authorized to access this resource.',
      );
    }
  }
}
