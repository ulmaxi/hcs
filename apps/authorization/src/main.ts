if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line: no-var-requires
  require('dotenv').config();
}

const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;
console.log({ JWT_SECRET_KEY, JWT_EXPIRES });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AMQ_URL, Queues } from '@ulmax/microservice/shared';
import { setupSwagger } from '@ulmax/server-shared';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, { cors: true });
  const basePath = '/api/auth';
  app = app.setGlobalPrefix(basePath)
  .useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app, basePath);
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [AMQ_URL],
      queue: Queues.Authorization
    }
  });
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();