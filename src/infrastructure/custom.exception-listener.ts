import { Injectable } from '@nestjs/common';
import { ExceptionListener, MessagingExceptionListener, ExceptionContext } from '@nestjstools/messaging';

@Injectable()
@MessagingExceptionListener()
export class CustomExceptionListener implements ExceptionListener {
  onException(context: ExceptionContext): Promise<void> {
    console.log(`\nHere I can handle exception If I want and do some action [CustomExceptionListener]`);
    return Promise.resolve();
  }
}
