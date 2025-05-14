process.env.PUBSUB_PROJECT_ID='test-project'
process.env.PUBSUB_EMULATOR_HOST='localhost:8085'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
