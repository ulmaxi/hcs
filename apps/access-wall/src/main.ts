import { NestFactory } from '@nestjs/core';
import { DataAccessRecordAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(DataAccessRecordAppModule);
  await app.listen(() => console.log(`Data-access-record Service is Listening`));
}
bootstrap();
