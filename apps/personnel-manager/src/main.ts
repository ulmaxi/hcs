import { NestFactory } from '@nestjs/core';
import { EHRPersonnelAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(EHRPersonnelAppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
