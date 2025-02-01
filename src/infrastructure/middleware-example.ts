import { Injectable } from '@nestjs/common';
import { MessagingMiddleware, Middleware, RoutingMessage } from '@nestjstools/messaging';

@Injectable()
@MessagingMiddleware('MiddlewareExample')
export class MiddlewareExample implements Middleware {
  next(next: RoutingMessage): Promise<RoutingMessage> {
    console.log('Middleware works! And forward object');
    return Promise.resolve(next);
  }
}
