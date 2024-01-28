import { HttpExceptionType } from './types';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(httpException: HttpExceptionType) {
    const { status, message } = httpException;
    super(message);
    this.status = status;
    this.message = message;
  }
}
