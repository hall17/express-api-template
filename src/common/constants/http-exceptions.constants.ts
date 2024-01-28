import { HttpStatus } from '../enums';
import { HttpExceptionType } from '../types';

export const HTTP_EXCEPTIONS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: 'Data Not found',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: 'Data already exists',
  },
  AUTHENTICATION_MISSING: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Authentication missing',
  },
  AUTHENTICATION_FAILED: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Authentication failed',
  },
  AUTHORIZATION_MISSING: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Authorization missing',
  },
  ACCOUNT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: 'Sorry, we could not find your account.',
  },
  WRONG_PASSWORD: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Wrong password',
  },
  USER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: 'User not found',
  },
  USER_WITH_THAT_EMAIL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: 'User with that email already exists',
  },
  USER_WITH_THAT_USER_ID_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: 'User with that userId already exists',
  },
} satisfies Record<string, HttpExceptionType>;
