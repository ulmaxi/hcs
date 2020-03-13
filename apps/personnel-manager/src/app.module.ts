import { Module } from '@nestjs/common';
import { EHRpersonnelModule } from '@ulmax/ehr';

@Module({
  imports: [EHRpersonnelModule],
  controllers: [],
  providers: [],
})
export class EHRPersonnelAppModule {}
