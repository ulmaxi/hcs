// tslint:disable: max-classes-per-file
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicroserviceModule } from '@ulmax/microservice';
import { AdmissionController } from './admission/admission.controller';
import { Admission } from './admission/admission.entity';
import { AdmissionService } from './admission/admission.service';
import { ConsultationController } from './consultation/consultation.controller';
import { Consultation } from './consultation/consultation.entity';
import { ConsultationService } from './consultation/consultation.service';
import { InstitutionController } from './institution/institution.controller';
import { Institution } from './institution/institution.entity';
import { InstitutionService } from './institution/institution.service';
import { LabTestController } from './labtest/labtest.controller';
import { LabTest } from './labtest/labtest.entity';
import { LabTestService } from './labtest/labtest.service';
import { PrescriptionController } from './prescription/prescription.controller';
import { Prescription } from './prescription/prescription.entity';
import { PrescriptionService } from './prescription/prescription.service';
import { ReviewController } from './review/review.controller';
import { Review } from './review/review.entity';
import { ReviewService } from './review/review.service';
import { StaffController } from './staff/staff.controller';
import { Staff } from './staff/staff.entity';
import { StaffService } from './staff/staff.service';
import { StaffCQRService } from './staff/staff.cqr';
import { InstitutionCQRService } from './institution/institution.cqr';
import { PrescriptionCQRService } from './prescription/prescription.cqr';
import { ConsultationCQRService } from './consultation/consultation.cqr';

const configs = [
  {
    controller: AdmissionController,
    provider: AdmissionService,
    model: Admission,
  },
  {
    controller: ConsultationController,
    provider: ConsultationService,
    model: Consultation,
  },
  {
    controller: InstitutionController,
    provider: InstitutionService,
    model: Institution,
  },
  { controller: LabTestController, provider: LabTestService, model: LabTest },
  {
    controller: PrescriptionController,
    provider: PrescriptionService,
    model: Prescription,
  },
  { controller: ReviewController, provider: ReviewService, model: Review },
  { controller: StaffController, provider: StaffService, model: Staff },
];

const models = [
  Admission,
  Consultation,
  Institution,
  LabTest,
  Prescription,
  Review,
  Staff,
];

/**
 * The database service module for the application
 */
@Module({
  imports: [TypeOrmModule.forFeature(models), MicroserviceModule],
  providers: [
    ...configs.map(c => c.provider),
    StaffCQRService,
    InstitutionCQRService,
    PrescriptionCQRService,
    ConsultationCQRService,
  ],
  exports: [...configs.map(c => c.provider)],
})
export class EHRDataServiceModule {
  constructor() {}
}

/**
 * the EHR database controller auto generated
 */
@Module({
  imports: [EHRDataServiceModule],
  controllers: [...configs.map(c => c.controller)],
  providers: [],
})
export class EHRDataControllerModule {}
