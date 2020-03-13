import { NestFactory } from '@nestjs/core';
import { AuthorizationAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationAppModule);
  await app.listen(3000);
}
bootstrap();
