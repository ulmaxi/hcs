import { NestFactory } from '@nestjs/core';
import { UlmaxCardNodeAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(UlmaxCardNodeAppModule);
  await app.listen(3000);
}
bootstrap();
