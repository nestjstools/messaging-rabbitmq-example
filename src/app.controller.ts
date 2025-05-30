import { Controller, Get } from '@nestjs/common';
import { CreateUser } from './application/command/create-user';
import { IMessageBus, MessageBus, RoutingMessage } from '@nestjstools/messaging';

@Controller()
export class AppController {
  constructor(
    @MessageBus('command.bus') private commandBus: IMessageBus,
    @MessageBus('redis.command.bus') private redisCommandBus: IMessageBus,
    @MessageBus('sqs-message.bus') private sqsMessageBus: IMessageBus,
    @MessageBus('pubsub-event.bus') private pubSubEventbus: IMessageBus,
    @MessageBus('message.bus') private ms: IMessageBus,
  ) {}

  @Get()
  createUserAsync(): string {
    this.commandBus.dispatch(new RoutingMessage(new CreateUser('John FROM Rabbit'), 'my_app_command.create_user'));
    return 'Message sent';
  }

  @Get('/redis')
  createUserAsyncViaRedisBus(): string {
    this.redisCommandBus.dispatch(new RoutingMessage(new CreateUser('John FROM REDIS'), 'my_app_command.create_user'));

    return 'Message sent';
  }

  @Get('/sqs')
  createUserBySqn(): string {
    this.sqsMessageBus.dispatch(new RoutingMessage(new CreateUser('John FROM Sqs'), 'my_app_command.create_user'));

    return 'Message sent';
  }

  @Get('/pubsub')
  createUserByPubSub(): string {
    this.pubSubEventbus.dispatch(new RoutingMessage(new CreateUser('John FROM PubSub'), 'my_app_command.create_user'));

    return 'Message sent';
  }

  @Get('/not-existed-handler')
  notExistedHandler(): string {
    this.commandBus.dispatch(new RoutingMessage(new CreateUser('John'), 'my_app_command.not_existed'));
    this.redisCommandBus.dispatch(new RoutingMessage(new CreateUser('John'), 'my_app_command.not_existed'));

    return 'Message sent';
  }
}
