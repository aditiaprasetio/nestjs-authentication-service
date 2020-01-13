
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let maxDuration = 5000; // 1000 = 1 seconds
    const request = context.switchToHttp().getRequest();
    if (request.method === 'POST' && request.url.includes('bulk')) {
      maxDuration = 60000; // 1 minutes
    }
    // console.info('request', request);
    // console.info('full url - request.url', request.url);
    // console.info('method   - request.method', request.method);
    // console.info('mainpath - request.route.path', request.route.path);
    return next.handle().pipe(timeout(maxDuration));
  }
}