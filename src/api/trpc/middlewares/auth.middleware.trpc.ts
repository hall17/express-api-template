import { HTTP_EXCEPTIONS } from '@api/common/constants';
import { User, HttpException } from '@api/common/types';
import { env } from '@api/env';
import { verify } from 'jsonwebtoken';

import { BaseMiddlewareFunction, Context } from '..';

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
    const token = req.cookies['Authorization'];

    if (!token) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    const verifiedUser = verify(token, env.ACCESS_TOKEN_SECRET_KEY as string) as User;
    req.user = verifiedUser;

    const userId = req.params.userId || req.body?.userId;

    if (!userId) {
      return next();
    } else if (userId && userId === req.user.id) {
      return next();
    } else if (userId && (verifiedUser.isAdmin || verifiedUser.isSuperAdmin)) {
      return next();
    } else {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }
  } catch (error) {
    throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
};

export const authenticateTokenTRPC = (options: { query?: boolean; body?: boolean } = { query: true, body: false }) => {
  return (({ ctx: { req }, next }) => {
    try {
      const token = options.query && req.query.token ? String(req.query.token) : req.body.token;

      if (!token) {
        throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
      }

      const verifiedUser = verify(token, env.ACCESS_TOKEN_SECRET_KEY) as User;

      req.user = verifiedUser;

      return next();
    } catch (error) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
    }
  }) satisfies BaseMiddlewareFunction<Context>;
};

export const authenticateAdminTRPC: BaseMiddlewareFunction<Context> = ({ ctx: { req }, next }) => {
  try {
    const token = getToken(req);

    if (!token) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    const verifiedUser = verify(token, env.ACCESS_TOKEN_SECRET_KEY) as User;

    if (!verifiedUser.isAdmin) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    req.user = verifiedUser;

    return next();
  } catch (error) {
    throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
};

export const authenticateSuperAdminTRPC: BaseMiddlewareFunction<Context> = ({ ctx: { req }, next }) => {
  try {
    const authorization = getToken(req);

    if (!authorization) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    const verifiedUser = verify(authorization, env.ACCESS_TOKEN_SECRET_KEY) as User;

    if (!verifiedUser.isSuperAdmin) {
      throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED);
    }

    req.user = verifiedUser;
    return next();
  } catch (error) {
    throw new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING);
  }
};
