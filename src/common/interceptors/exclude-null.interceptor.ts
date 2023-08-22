import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  private recursivelyStripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((v) => this.recursivelyStripNullValues(v));
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          this.recursivelyStripNullValues(value),
        ]),
      );
    }
    if (value !== null) {
      return value;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((value) => this.recursivelyStripNullValues(value)));
  }
}
