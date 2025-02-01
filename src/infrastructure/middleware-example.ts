import { Injectable } from '@nestjs/common';
import { MessagingMiddleware, Middleware, RoutingMessage, MiddlewareContext } from '@nestjstools/messaging';

@Injectable()
@MessagingMiddleware('MiddlewareExample')
export class MiddlewareExample implements Middleware {
  async process(message: RoutingMessage, context: MiddlewareContext): Promise<MiddlewareContext> {
    console.log('MIDDLEWARE WORKS');
    return await context.next().process(message, context);
  }
}
