import { Module } from '@nestjs/common';
import { GeneralPublicService } from './general-public.service';

@Module({
  providers: [GeneralPublicService],
  exports: [GeneralPublicService],
})
export class GeneralPublicModule {}
