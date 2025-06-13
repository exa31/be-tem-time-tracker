import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import VarEnv from '../config/varEnv';

class Helper {
  public static getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  public static generateToken(userId: string): string {
    const payload = { id_user: userId };
    console.log('Generating token for user:', VarEnv.secret_jwt);
    return jwt.sign(payload, VarEnv.secret_jwt as string, {
      expiresIn: '1d', // Token will expire in 1 day
    });
  }
}

export default Helper;
