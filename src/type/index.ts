import jwt from 'jsonwebtoken';

export type PayloadJWT = jwt.JwtPayload & {
  id_user: string;
};
