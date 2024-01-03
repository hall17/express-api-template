import { StatusCodes } from 'http-status-codes';

function makeHttpException(code: number, message: string) {
  return {
    status: code,
    message,
  };
}

export const httpExceptions = {
  authenticationMissing: makeHttpException(StatusCodes.UNAUTHORIZED, 'Authentication missing!'),
  authenticationFailed: makeHttpException(StatusCodes.UNAUTHORIZED, 'Authentication failed!'),
  authorizationMissing: makeHttpException(StatusCodes.FORBIDDEN, 'Authorization missing!'),
  accountNotFound: makeHttpException(StatusCodes.NOT_FOUND, 'Sorry, we could not find your account.'),
  wrongPassword: makeHttpException(StatusCodes.NOT_FOUND, 'Wrong Password!'),
  userNotFound: makeHttpException(StatusCodes.NOT_FOUND, 'User not found'),
  userWithThatEmailAlreadyExists: makeHttpException(StatusCodes.CONFLICT, 'User with that email already exists'),
  userWithThatUserIdAlreadyExists: makeHttpException(StatusCodes.CONFLICT, 'User with that userId already exists'),
};
