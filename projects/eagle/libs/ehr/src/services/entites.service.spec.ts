import { EntityTestProvider, ProviderConfig } from '@eagle/testing';
import { Admission } from '../models/admission.entity';
import { AdmissionService } from './admission.service';
import { Consultation } from '../models/consultation.entity';
import { ConsultationService } from './consultation.service';
import { InstitutionService } from './institution.service';
import { Institution } from '../models/institution.entity';
import { LabTest } from '../models/labtest.entity';
import { LabTestService } from './LabTest.service';
import { Prescription } from '../models/prescription.entity';
import { PrescriptionService } from './prescription.service';
import { Review } from '../models/review.entity';
import { ReviewService } from './review.service';
import { StaffService } from './staff.service';
import { Staff } from '../models/staff.entity';

describe('EHR autogenerated providers', () => {

    const configs: Array<ProviderConfig<any>> = [
        { entity: Admission, provider: AdmissionService },
        { entity: Consultation, provider: ConsultationService },
        { entity: Institution, provider: InstitutionService },
        { entity: LabTest, provider: LabTestService },
        { entity: Prescription, provider: PrescriptionService },
        { entity: Review, provider: ReviewService },
        { entity: Staff, provider: StaffService },
    ];

    configs.forEach((cfg) => new EntityTestProvider(cfg).test());
});
