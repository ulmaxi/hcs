// tslint:disable: no-empty
import { admissionFactory, consultationFactory, labTestFactory, prescriptionFactory, reviewFactory } from '@eagle/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelService } from '../personnel/personel.service';
import { MedicalCarePlan, TrackedMedicalCarePlan } from '../util';
import { ClaimUploadStore } from './claim-upload-store';
import { MedicalClaimService } from './medical-claim.service';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';
import { UploadMedicalCareService } from './upload-medicare.service';

describe('MedicalClaimService', () => {
  let module: TestingModule;
  let svc: MedicalClaimService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MedicalClaimService,
        {
          provide: UploadMedicalCareService, useValue: {
            createAdmission: jest.fn(),
            createLabtest: jest.fn(),
            createPrescriptions: jest.fn(),
            createReview: jest.fn(),
            createConsultation: jest.fn(),
          },
        },
        { provide: PersonnelService, useValue: { retriveStaffID: jest.fn(), retriveTrackIdWithPhoneNo: jest.fn() } },
        {
          provide: RevokeMedicalCarePlanService, useValue: {
            deleteAdmission: jest.fn(async () => { }),
            deleteConsultation: jest.fn(async () => { }),
            deleteLabtests: jest.fn(async () => { }),
            deletePrescriptions: jest.fn(async () => { }),
            deleteReview: jest.fn(async () => { }),
          },
        },

      ],
    }).compile();

    svc = module.get<MedicalClaimService>(MedicalClaimService);
  });

  describe('createMedicarePlan', () => {
    it('should call to continueMedicarePlan', async () => {
      const spy = jest.spyOn(svc, 'continueMedicarePlan').mockResolvedValueOnce({} as any);
      svc.createMedicarePlan('institution', {} as any);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('continueMedicarePlan', () => {
    it('should rethrow the error and rolllack immediately', async () => {
      const mockError = new Error('mocking error');
      const rolllackSpy = jest.spyOn(svc, 'rollback').mockResolvedValueOnce();
      jest.spyOn(module.get<PersonnelService>(PersonnelService), 'retriveStaffID')
        .mockRejectedValueOnce(mockError);
      try {
        const _ = await svc.continueMedicarePlan(
          'insitution',
          'consultationTrackId',
          { staffPhoneNo: '122234' } as Partial<MedicalCarePlan> as any,
        );
      } catch (error) {
        expect(rolllackSpy).toHaveBeenCalled();
        expect(error.message).toMatch(mockError.message);
      }
    });

    it('should save the claim', async () => {
      const personnel = module.get<PersonnelService>(PersonnelService);
      const uploader = module.get<UploadMedicalCareService>(UploadMedicalCareService);
      const consultation = consultationFactory.build();
      const admission = admissionFactory.build({ consulationTrackId: consultation.trackId });
      const labTest = labTestFactory.buildList(3);
      const prescriptions = prescriptionFactory.buildList(3);
      const review = reviewFactory.build({ consulationTrackId: consultation.trackId });

      jest.spyOn(personnel, 'retriveStaffID')
        .mockResolvedValue(consultation.consultantId);
      jest.spyOn(personnel, 'retriveTrackIdWithPhoneNo')
        .mockResolvedValue(consultation.patientId);
      jest.spyOn(uploader, 'createAdmission')
        .mockResolvedValue(admission);
      jest.spyOn(uploader, 'createLabtest')
        .mockResolvedValue(labTest);
      jest.spyOn(uploader, 'createPrescriptions')
        .mockResolvedValue(prescriptions);
      jest.spyOn(uploader, 'createReview')
        .mockResolvedValue(review);
      jest.spyOn(uploader, 'createConsultation')
        .mockResolvedValue(consultation);
      const expected = {
        consultation,
        patientId: consultation.patientId,
        staffId: consultation.consultantId,
        admission,
        prescriptions,
        review,
        labTests: labTest,
      } as TrackedMedicalCarePlan;
      const res = await svc.continueMedicarePlan('instituiton', consultation.trackId,
      {
        consultation,
        patientPhoneNo: '304892348',
        staffPhoneNo: '24234234',
        admission,
        prescriptions,
        review,
        labTests: labTest,
      });
      // complex assertion so doing a sub assertion
      expect(res.consultation).toStrictEqual(consultation);
      // console.log(res.admission, admission);
      expect(res.admission).toStrictEqual(admission);
      expect(res.labTests).toStrictEqual(labTest);
      expect(res.prescriptions).toStrictEqual(prescriptions);
      expect(res.review).toStrictEqual(review);
      expect(res.staffId).toStrictEqual(consultation.consultantId);
      expect(res.patientId).toStrictEqual(consultation.patientId);
    });
  });

  describe('rollback', () => {
    it('should call deleteAdmission  with ', async () => {
      const store = new ClaimUploadStore(undefined);
      const recaller = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
      store.update('admission', { trackerId: 'Admission', error: undefined });
      svc.rollback(store);
      expect(recaller.deleteAdmission).toHaveBeenCalled();
    });

    it('should call deleteConsultation  with ', async () => {
      const store = new ClaimUploadStore(undefined);
      const recaller = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
      store.update('consultation', { trackerId: 'Consultation', error: undefined });
      svc.rollback(store);
      expect(recaller.deleteConsultation).toHaveBeenCalled();
    });

    it('should call deleteLabtests  with ', async () => {
      const store = new ClaimUploadStore(undefined);
      const recaller = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
      store.update('labTests', { trackerId: 'Labtests', error: undefined });
      svc.rollback(store);
      expect(recaller.deleteLabtests).toHaveBeenCalled();
    });

    it('should call deletePrescriptions  with ', async () => {
      const store = new ClaimUploadStore(undefined);
      const recaller = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
      store.update('prescriptions', { trackerId: 'Prescriptions', error: undefined });
      svc.rollback(store);
      expect(recaller.deletePrescriptions).toHaveBeenCalled();
    });

    it('should call deleteReview  with ', async () => {
      const store = new ClaimUploadStore(undefined);
      const recaller = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
      store.update('review', { trackerId: 'Review', error: undefined });
      svc.rollback(store);
      expect(recaller.deleteReview).toHaveBeenCalled();
    });
  });

});
