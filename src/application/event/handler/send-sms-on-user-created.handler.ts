import { UserCreated } from '../user-created';
import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { InMemorySmsSender } from '../../../infrastructure/in-memory-sms-sender';

@MessageHandler('my_app_event.user_created')
export class SendSmsOnUserCreatedHandler implements IMessageHandler<UserCreated>{
  constructor(private readonly sender: InMemorySmsSender) {
  }

  handle(message: UserCreated): Promise<object | void> {
    //TODO Logic there
    this.sender.send(message.name);

    return Promise.resolve();
  }
}
