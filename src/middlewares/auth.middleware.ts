import { HTTP_EXCEPTIONS } from '@api/common/constants';
import { HttpException, User } from '@api/common/types';
import { env } from '@api/env';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

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
      const verifiedUser = verify(authorization, env.ACCESS_TOKEN_SECRET_KEY as string) as User;
      req.user = verifiedUser;

      next();
    } else {
      next(new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_FAILED));
    }
  } catch (error) {
    next(new HttpException(HTTP_EXCEPTIONS.AUTHENTICATION_MISSING));
  }
};
