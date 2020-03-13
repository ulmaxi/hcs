import { Module } from '@nestjs/common';
import { EHRMedicalClaimModule, EHRHistorySnaphotModule } from '@ulmax/ehr';
import { EHRHistoryModule } from '@ulmax/ehr-intercom';

@Module({
  imports: [
    EHRMedicalClaimModule,
    EHRHistorySnaphotModule,
    EHRHistoryModule
  ]
})
export class EHRMedicalHistoryAppModule {}
