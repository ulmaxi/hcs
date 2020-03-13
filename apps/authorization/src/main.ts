import { NestFactory } from '@nestjs/core';
import { AuthorizationAppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationAppModule, { cors: true });
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
  });
  microservice.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
