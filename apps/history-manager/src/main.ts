import { NestFactory } from '@nestjs/core';
import { EHRMedicalHistoryAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(EHRMedicalHistoryAppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
