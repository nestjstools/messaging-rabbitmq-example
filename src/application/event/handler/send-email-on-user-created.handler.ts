import { UserCreated } from '../user-created';
import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { InMemoryEmailSender } from '../../../infrastructure/in-memory-email-sender';

@MessageHandler('my_app_event.user_created')
export class SendEmailOnUserCreatedHandler implements IMessageHandler<UserCreated>{
  constructor(private readonly sender: InMemoryEmailSender) {
  }

  handle(message: UserCreated): Promise<object | void> {
    //TODO Logic there
    this.sender.send(message.name);

    return Promise.resolve();
  }
}
