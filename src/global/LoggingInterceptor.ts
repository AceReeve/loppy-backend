import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const now = Date.now();

    this.logger.log(`
      method : ${method} 
      path : ${url}
      user-agent : ${userAgent} 
      ip: ${ip} 
      controller : ${context.getClass().name} 
      controller-method : ${context.getHandler()}
    `);

    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        this.logger.log(`
          status-code : ${statusCode} 
          response-time : ${Date.now() - now} ms
        `);
        this.logger.debug('Response');

        console.log(res);
      }),
    );
  }
}
