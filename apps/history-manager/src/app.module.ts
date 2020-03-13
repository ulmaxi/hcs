import { Module } from '@nestjs/common';
import { EHRMedicalClaimModule, EHRHistorySnaphotModule } from '@ulmax/ehr';
import { EHRHistoryModule } from '@ulmax/ehr-intercom';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    EHRMedicalClaimModule,
    EHRHistorySnaphotModule,
    EHRHistoryModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV))
  ]
})
export class EHRMedicalHistoryAppModule {}
