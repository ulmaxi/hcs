import { NestFactory } from '@nestjs/core';
import { UlmaxCardNodeAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(UlmaxCardNodeAppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
