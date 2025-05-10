import { UserCreated } from '../user-created';
import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';

@MessageHandler('my_app_event.user_created')
export class ThrowExceptionOnUserCreatedHandler implements IMessageHandler<UserCreated>{
  handle(message: UserCreated): Promise<object | void> {
    throw new Error('Fake throw');
  }
}
