import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { AMQ_URL, Queues } from '@ulmax/microservice/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [AMQ_URL],
      queue: Queues.Admin,
    },
  });

  await app.listen(() => console.log(`messaging service is listening`));
}
bootstrap();
