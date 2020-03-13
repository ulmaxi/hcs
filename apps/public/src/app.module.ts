import { Module } from '@nestjs/common';
import { GeneralPublicDataControllerModule, GeneralPublicModule } from '@ulmax/general-public';

@Module({
  imports: [ 
     GeneralPublicDataControllerModule,
    GeneralPublicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
