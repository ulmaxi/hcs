import { NestFactory } from '@nestjs/core';
import { DataAccessRecordAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(DataAccessRecordAppModule);
  await app.listen(3000);
}
bootstrap();
