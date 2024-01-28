import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET_KEY } from '@/config';

import { HTTP_EXCEPTIONS } from '@/common/constants';
import { HttpException, User } from '@/common/types';

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
        next(new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED));
      }

      next();
    } else {
      next(new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED));
    }
  } catch (error) {
    next(new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING));
  }
};
