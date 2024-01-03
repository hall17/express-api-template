import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET_KEY } from '@/config';
import { httpExceptions } from '@/utils';

import { HttpException } from '@/types/HttpException';
import { User } from '@/types/types';

const getAuthorization = (req: Request) => {
  const cookie = req.cookies['Authorization'];
  if (cookie) {
    return cookie;
  }

  // disable bearer token
  // const header = req.header('Authorization');
  // if (header) {
  //   return header.split('Bearer ')[1];
  // }

  return null;
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = getAuthorization(req);
    if (authorization) {
      const result = verify(authorization, ACCESS_TOKEN_SECRET_KEY as string) as User;
      req.user = result;
      // TODO: add admin role check
      if ('userId' in req.params && req.params.userId !== result.id && !result.isAdmin) {
        next(new HttpException(httpExceptions.authenticationFailed));
      }

      next();
    } else {
      next(new HttpException(httpExceptions.authenticationFailed));
    }
  } catch (error) {
    next(new HttpException(httpExceptions.authenticationMissing));
  }
};
