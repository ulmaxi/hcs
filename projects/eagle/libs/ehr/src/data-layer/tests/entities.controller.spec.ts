import { ControllerConfig, EntityTestController } from '@eagle/testing';
import { AdmissionController } from '../admission/admission.controller';
import { AdmissionService } from '../admission/admission.service';
import { ConsultationController } from '../consultation/consultation.controller';
import { ConsultationService } from '../consultation/consultation.service';
import { InstitutionController } from '../institution/institution.controller';
import { InstitutionService } from '../institution/institution.service';
import { LabTestController } from '../labtest/labtest.controller';
import { LabTestService } from '../labtest/labtest.service';
import { PrescriptionController } from '../prescription/prescription.controller';
import { PrescriptionService } from '../prescription/prescription.service';
import { ReviewController } from '../review/review.controller';
import { ReviewService } from '../review/review.service';
import { StaffController } from '../staff/staff.controller';
import { StaffService } from '../staff/staff.service';

describe('EHR autogenerated Controllers', () => {
    const configs: ControllerConfig[] = [
        { controller: AdmissionController, provider: AdmissionService },
        { controller: ConsultationController, provider: ConsultationService },
        { controller: InstitutionController, provider: InstitutionService },
        { controller: LabTestController, provider: LabTestService },
        { controller: PrescriptionController, provider: PrescriptionService },
        { controller: ReviewController, provider: ReviewService },
        { controller: StaffController, provider: StaffService },
    ];

    configs.forEach((cfg) => new EntityTestController(cfg).test());
});
