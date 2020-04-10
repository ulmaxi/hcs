import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EHRHistorySnaphotModule, EHRMedicalClaimModule, ehrModels, EHRpersonnelModule, EHRDataControllerModule } from '@ulmax/ehr';
import { EHRHistoryModule } from '@ulmax/ehr-intercom';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    EHRMedicalClaimModule,
    EHRHistorySnaphotModule,
    EHRHistoryModule,
    EHRpersonnelModule,
    EHRDataControllerModule,
    TypeOrmModule.forRoot({...configDatabase(process.env.NODE_ENV), entities: [...ehrModels]}),
  ],
})
export class AppModule {}
