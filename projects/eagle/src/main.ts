// tslint:disable-next-line: no-var-requires
require('dotenv').config();

const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;
console.log({ JWT_SECRET_KEY, JWT_EXPIRES });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
