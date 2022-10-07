import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = ctx.getResponse<Response>();
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'internal server error' };
    const err =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest()),
      ...err,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
