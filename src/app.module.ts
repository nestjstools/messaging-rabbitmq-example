import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CreateUserHandler } from './application/command/handler/create-user.handler';
import { SendEmailOnUserCreatedHandler } from './application/event/handler/send-email-on-user-created.handler';
import { SendSmsOnUserCreatedHandler } from './application/event/handler/send-sms-on-user-created.handler';
import { AmqpChannelConfig, ExchangeType, InMemoryChannelConfig, MessagingModule } from '@nestjstools/messaging';
import { MessagingRabbitmqExtensionModule } from '@nestjstools/messaging-rabbitmq-extension';
import { InMemoryEmailSender } from './infrastructure/in-memory-email-sender';
import { InMemorySmsSender } from './infrastructure/in-memory-sms-sender';
import { MiddlewareExample } from './infrastructure/middleware-example';
import { Base64Normalizer } from './infrastructure/base64-normalizer.service';
import { MessagingRedisExtensionModule, RedisChannelConfig } from '@nestjstools/messaging-redis-extension';
import { CustomExceptionListener } from './infrastructure/custom.exception-listener';
import {
  ThrowExceptionOnUserCreatedHandler
} from './application/event/handler/throw-exception-on-user-created.handler';

@Module({
  imports: [
    MessagingRabbitmqExtensionModule,
    MessagingRedisExtensionModule,
    MessagingModule.forRoot({
      buses: [
        {
          name: 'message.bus',
          channels: ['my-channel'],
        },
        {
          name: 'command.bus',
          channels: ['async-command'],
        },
        {
          name: 'event.bus',
          channels: ['async-event'],
        },
        {
          name: 'redis.command.bus',
          channels: ['redis-channel'],
        },
      ],
      channels: [
        new InMemoryChannelConfig({
          name: 'my-channel',
          middlewares: [],
          avoidErrorsForNotExistedHandlers: true,
        }),
        new RedisChannelConfig({
          name: 'redis-channel',
          middlewares: [],
          avoidErrorsForNotExistedHandlers: true,
          queue: 'my-queue',
          connection: {
            port: 6379,
            host: '127.0.0.1',
          },
        }),
        new AmqpChannelConfig({
          name: 'async-command',
          connectionUri: 'amqp://guest:guest@localhost:5672/',
          exchangeName: 'my_app_command.exchange',
          bindingKeys: ['my_app_command.#'],
          exchangeType: ExchangeType.TOPIC,
          queue: 'my_app.command',
          avoidErrorsForNotExistedHandlers: false,
          deadLetterQueueFeature: true,
          middlewares: [
            MiddlewareExample,
          ],
          autoCreate: true,
          enableConsumer: true,
        }),
        new AmqpChannelConfig({
          name: 'async-event',
          connectionUri: 'amqp://guest:guest@localhost:5672/',
          exchangeName: 'my_app_event.exchange',
          bindingKeys: ['my_app_event.#'],
          exchangeType: ExchangeType.TOPIC,
          queue: 'my_app.event',
          autoCreate: true,
          enableConsumer: true,
          deadLetterQueueFeature: true,
          avoidErrorsForNotExistedHandlers: true,
        }),
      ],
      debug: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    InMemoryEmailSender,
    Base64Normalizer,
    InMemorySmsSender,
    CreateUserHandler,
    MiddlewareExample,
    SendEmailOnUserCreatedHandler,
    SendSmsOnUserCreatedHandler,
    CustomExceptionListener,
    ThrowExceptionOnUserCreatedHandler,
  ],
})
export class AppModule {}
