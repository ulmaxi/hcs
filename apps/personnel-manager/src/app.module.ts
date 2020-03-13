import { Module } from '@nestjs/common';
import { EHRpersonnelModule } from '@ulmax/ehr';

@Module({
  imports: [EHRpersonnelModule]
})
export class EHRPersonnelAppModule {}
