export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(httpException: { status: number; message: string }) {
    const { status, message } = httpException;
    super(message);
    this.status = status;
    this.message = message;
  }
}
