import { Module } from '@nestjs/common';
import {
  GeneralPublicDataControllerModule,
  GeneralPublicModule,
  Emergency,
} from '@ulmax/general-public';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    GeneralPublicDataControllerModule,
    GeneralPublicModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({...configDatabase(process.env.NODE_ENV), entities: [Emergency]}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
