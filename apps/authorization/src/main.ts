import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AMQ_URL, Queues } from '@ulmax/microservice/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [AMQ_URL],
      queue: Queues.Authorization
    }
  });
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();