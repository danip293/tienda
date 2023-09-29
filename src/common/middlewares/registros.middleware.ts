import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;
    const start = Date.now();

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const end = Date.now();
      const duration = end - start;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} - ${duration}ms`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}

export default LogsMiddleware;
