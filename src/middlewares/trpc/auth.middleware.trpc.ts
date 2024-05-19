import { HTTP_EXCEPTIONS } from '@api/common/constants';
import { User, HttpException } from '@api/common/types';
import { env } from '@api/env';
import { BaseMiddlewareFunction, Context } from '@api/trpc';
import { verify } from 'jsonwebtoken';

const getToken = (req: Context['req']) => {
  const cookie = req.cookies['Authorization'];

  // disable bearer token
  // const header = req.header('Authorization');
  // if (header) {
  //   return header.split('Bearer ')[1];
  // }

  return cookie;
};

export const authenticateTRPC: BaseMiddlewareFunction<Context> = ({ ctx: { req }, next }) => {
  try {
    const token = getToken(req);

    if (!token) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    const verifiedUser = verify(token, env.ACCESS_TOKEN_SECRET_KEY as string) as User;
    req.user = verifiedUser;

    // run your checks here

    // every trpc middleware must return next() to continue
    return next();
  } catch (error) {
    throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
};
