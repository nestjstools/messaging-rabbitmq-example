import {
  HookMessage,
  LifecycleHook,
  MessagingLifecycleHook,
  MessagingLifecycleHookListener,
} from '@nestjstools/messaging';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@MessagingLifecycleHook(LifecycleHook.AFTER_MESSAGE_HANDLER_EXECUTION)
export class AfterMessageHandlerExecutionHook implements MessagingLifecycleHookListener {
  constructor(private readonly logger: Logger) {
  }

  hook(message: HookMessage): Promise<void> {
    this.logger.log(`💡 Here I can do some action ON HOOK | fro [${message.routingKey}]`);
    return Promise.resolve();
  }
}
