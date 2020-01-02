import { Module } from '@nestjs/common';
import { EHRpersonnelModule } from '../personnel/personnel.module';
import { MedicalClaimController } from './medical-claim.controller';
import { MedicalClaimService } from './medical-claim.service';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';
import { UploadMedicalCareService } from './upload-medicare.service';

/**
 * Allows uploading of medical information from any
 * EHR provider
 */
@Module({
  imports: [EHRpersonnelModule],
  controllers: [MedicalClaimController],
  providers: [
    MedicalClaimService,
    RevokeMedicalCarePlanService,
    UploadMedicalCareService,
  ],
})
export class EHRMedicalClaimModule { }
