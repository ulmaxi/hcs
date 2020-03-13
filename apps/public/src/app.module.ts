import { Module } from '@nestjs/common';
import { GeneralPublicDataControllerModule, GeneralPublicModule } from '@ulmax/general-public';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [ 
     GeneralPublicDataControllerModule,
     GeneralPublicModule,
     TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV))
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
