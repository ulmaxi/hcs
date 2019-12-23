// tslint:disable: no-empty
import { TestingModule, Test } from '@nestjs/testing';
import { MedicalClaimService } from './medical-claim.service';
import { UploadMedicalCareService } from './upload-medicare.service';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';
import { MedicalCarePlan } from '../util';
import { ClaimUploadStore } from './claim-upload-store';
import { PersonnelService } from '../personnel/personel.service';

describe('MedicalClaimService', () => {
    let module: TestingModule;
    let svc: MedicalClaimService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                MedicalClaimService,
                { provide: UploadMedicalCareService, useValue: {  } },
                { provide: PersonnelService, useValue: { retriveStaffID: jest.fn } },
                {
                    provide: RevokeMedicalCarePlanService, useValue: {
                        deleteAdmission: jest.fn(async () => { }),
                        deleteConsultation: jest.fn(async () => { }),
                        deleteLabtests: jest.fn(async () => { }),
                        deletePrescriptions: jest.fn(async () => { }),
                        deleteReview: jest.fn(async () => { }),
                    }
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
