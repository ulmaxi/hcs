import { Module } from '@nestjs/common';
import { EhrIntercomService } from './ehr-intercom.service';

@Module({
  providers: [EhrIntercomService],
  exports: [EhrIntercomService],
})
export class EhrIntercomModule {}
