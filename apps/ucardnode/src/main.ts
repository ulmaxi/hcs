import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AMQ_URL, Queues } from '@ulmax/microservice/shared';
import { setupSwagger } from '@ulmax/server-shared';
import { AppModule } from './app.module';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, { cors: true });
  const basePath = '/api/cardnode';
  app = app.setGlobalPrefix(basePath)
  .useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app, basePath);
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [AMQ_URL],
      queue: Queues.CardNode,
    },
  });
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
