import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@ulmax/server-shared';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, { cors: true });
  const basePath = '/api/public';
  app = app.setGlobalPrefix(basePath)
  .useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app, basePath);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
  