import { Test } from '@nestjs/testing';
import { ehr_data_preload } from '@ulmax/testing';
import { AdmissionService } from '../../data-layer/admission/admission.service';
import { InstitutionService } from '../../data-layer/institution/institution.service';
import { LabTestService } from '../../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../../data-layer/prescription/prescription.service';
import { FieldSnaphotService } from './fields-snapshot.service';

describe('FieldSnaphotFieldSnaphotService', () => {
  let svc: FieldSnaphotService;
  const { institutions, admissions, prescriptions, labtests } = ehr_data_preload(2);

  const mocker = (value) => ({
    repository: {
      findByIds: () => Promise.resolve(value),
    },
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FieldSnaphotService,
        { provide: InstitutionService, useValue: mocker(institutions) },
        { provide: AdmissionService, useValue: mocker(admissions) },
        { provide: PrescriptionService, useValue: mocker(prescriptions) },
        { provide: LabTestService, useValue: mocker(labtests) },
      ],
    }).compile();

    svc = module.get<FieldSnaphotService>(FieldSnaphotService);
  });

  it('should return a map of institutions and their Ids', async () => {
    const map = await svc.institutions(institutions.map((i) => i.id));
    const institution = institutions[0];
    expect(map.get(institution.id)).toStrictEqual(institution);
  });
  it('should return a map of prescriptions and their Ids', async () => {
    const map = await svc.prescriptions(prescriptions.map((i) => i.id));
    const prescription = prescriptions[0];
    expect(map.get(prescription.id)).toStrictEqual(prescription);
  });
  it('should return a map of labtests and their Ids', async () => {
    const map = await svc.labtests(labtests.map((i) => i.id));
    const labtest = labtests[0];
    expect(map.get(labtest.id)).toStrictEqual(labtest);
  });

  it('should return a map of admissions and their Ids', async () => {
    const map = await svc.admissions(admissions.map((i) => i.id));
    const admission = admissions[0];
    expect(map.get(admission.id)).toStrictEqual(admission);
  });

});
