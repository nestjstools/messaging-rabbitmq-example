import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CreateUserHandler } from './application/command/handler/create-user.handler';
import { SendEmailOnUserCreatedHandler } from './application/event/handler/send-email-on-user-created.handler';
import { SendSmsOnUserCreatedHandler } from './application/event/handler/send-sms-on-user-created.handler';
import { InMemoryChannelConfig, MessagingModule } from '@nestjstools/messaging';
import { MessagingRabbitmqExtensionModule, RmqChannelConfig, ExchangeType } from '@nestjstools/messaging-rabbitmq-extension';
import { InMemoryEmailSender } from './infrastructure/in-memory-email-sender';
import { InMemorySmsSender } from './infrastructure/in-memory-sms-sender';
import { MiddlewareExample } from './infrastructure/middleware-example';
import { Base64Normalizer } from './infrastructure/base64-normalizer.service';
import { MessagingRedisExtensionModule, RedisChannelConfig } from '@nestjstools/messaging-redis-extension';
import { CustomExceptionListener } from './infrastructure/custom.exception-listener';
import {
  ThrowExceptionOnUserCreatedHandler
} from './application/event/handler/throw-exception-on-user-created.handler';
import { AmazonSqsChannelConfig, MessagingAmazonSqsExtensionModule } from '@nestjstools/messaging-amazon-sqs-extension';
import {
  GooglePubSubChannelConfig,
  MessagingGooglePubSubExtensionModule,
} from '@nestjstools/messaging-google-pubsub-extension';
import { MessagingNatsExtensionModule, NatsJetStreamChannelConfig } from '@nestjstools/messaging-nats-extension';

@Module({
  imports: [
    MessagingRabbitmqExtensionModule,
    MessagingRedisExtensionModule,
    MessagingAmazonSqsExtensionModule,
    MessagingGooglePubSubExtensionModule,
    MessagingNatsExtensionModule,
    MessagingModule.forRootAsync({
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
        {
          name: 'sqs-message.bus',
          channels: ['sqs-channel'],
        },
        {
          name: 'pubsub-event.bus',
          channels: ['pubsub-event'],
        },
        {
          name: 'nats.bus',
          channels: ['nats-channel'],
        },
      ],
      useChannelFactory: () => [
        new InMemoryChannelConfig({
          name: 'my-channel',
          middlewares: [],
          avoidErrorsForNotExistedHandlers: true,
        }),
        new NatsJetStreamChannelConfig({
          name: 'nats-channel',
          connectionUris: ['nats://localhost:4222'],
          streamConfig: {
            autoUpdate: true,
            deliverSubjects: ['app.example_subject'],
            streamName: 'new-stream2',
          },
          consumerConfig: {
            autoUpdate: true,
            durableName: 'nats-durable_name2',
            subject: 'app.example_subject',
          },
          middlewares: [],
          avoidErrorsForNotExistedHandlers: true,
        }),
        // new NatsChannelConfig({
        //   name: 'nats-channel',
        //   connectionUris: ['nats://localhost:4222'],
        //   subscriberName: 'nats-event',
        //   middlewares: [],
        //   avoidErrorsForNotExistedHandlers: true,
        // }),
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
        new RmqChannelConfig({
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
        new RmqChannelConfig({
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
        new AmazonSqsChannelConfig({
          name: 'sqs-channel',
          queueName: 'ds',
          endpoint: 'ds',
          enableConsumer: true,
          avoidErrorsForNotExistedHandlers: true,
          region: 'elasticmq',
          queueUrl: 'http://localhost:9324/queue/test_queue',
          autoCreate: true,
          credentials: {
            accessKeyId: 'x',
            secretAccessKey: 'x',
          },
          deadLetterQueue: true,
        }),
        new GooglePubSubChannelConfig({
          name: 'pubsub-event',
          enableConsumer: true, // Enable if you want to consume messages
          autoCreate: true, // Auto-create queue if it doesn't exist
          credentials: { // Optional
            projectId: 'test-project',
          },
          topicName: 'eventTopic',
          subscriptionName: 'eventSubscriptionTopic',
        })
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
