import { CreateUser } from '../create-user';
import { IMessageBus, IMessageHandler, MessageBus, MessageHandler, RoutingMessage } from '@nestjstools/messaging';
import { UserCreated } from '../../event/user-created';

@MessageHandler('my_app_command.create_user')
export class CreateUserHandler implements IMessageHandler<CreateUser>{
  constructor(
    @MessageBus('event.bus') private readonly eventBus: IMessageBus,
  ) {
  }

  handle(message: CreateUser): Promise<object | void> {
    // TODO Logic there
    console.log(`Creating user... ${message.name}`);

    this.eventBus.dispatch(new RoutingMessage(new UserCreated(message.name), 'my_app_event.user_created'))

    return Promise.resolve();
  }
}
