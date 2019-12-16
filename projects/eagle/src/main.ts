// tslint:disable-next-line: no-var-requires
require('dotenv').config();

const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;
console.log({ JWT_SECRET_KEY, JWT_EXPIRES });

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  // app.useGlobalPipes();
  setupSwagger(app);
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.startAllMicroservicesAsync();
  await app.listen(3001);
}
bootstrap();

