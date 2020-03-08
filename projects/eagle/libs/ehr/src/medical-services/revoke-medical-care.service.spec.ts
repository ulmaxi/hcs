import { Test, TestingModule } from '@nestjs/testing';
import * as testing from '@ulmax/testing';
import { AdmissionService } from '../data-layer/admission/admission.service';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { LabTestService } from '../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../data-layer/prescription/prescription.service';
import { ReviewService } from '../data-layer/review/review.service';
import { StaffService } from '../data-layer/staff/staff.service';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';

describe('RevokeMedicalClaimService', () => {
    let module: TestingModule;
    let svc: RevokeMedicalCarePlanService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                RevokeMedicalCarePlanService,
                { provide: AdmissionService, useValue: testing.serviceFactoryMock({ factory: testing.admissionFactory, preload: 5 }) },
                { provide: LabTestService, useValue: testing.serviceFactoryMock({ factory: testing.labTestFactory, preload: 5 }) },
                { provide: PrescriptionService, useValue: testing.serviceFactoryMock({ factory: testing.prescriptionFactory, preload: 5 }) },
                { provide: ReviewService, useValue: testing.serviceFactoryMock({ factory: testing.reviewFactory, preload: 5 }) },
                { provide: StaffService, useValue: testing.serviceFactoryMock({ factory: testing.staffFactory, preload: 5 }) },
                { provide: ConsultationService, useValue: testing.serviceFactoryMock({ factory: testing.consultationFactory, preload: 5 }) },
            ],
        }).compile();

        svc = module.get<RevokeMedicalCarePlanService>(RevokeMedicalCarePlanService);
    });

    describe('deleteAdmission', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteAdmission()).toEqual(undefined);
        });

        it('should return the deleted admission', async () => {
            const admission = await module.get<AdmissionService>(AdmissionService)
                .repository.save(testing.admissionFactory.build());
            expect(await svc.deleteAdmission(admission.id)).toStrictEqual(admission);
        });
    });
    describe('deleteLabtests', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteLabtests()).toEqual(undefined);
        });

        it('should return the deleted labtests', async () => {
            const saved = await Promise.all(
                testing.labTestFactory.buildList(5)
                    .map(async (t) => await module.get<LabTestService>(LabTestService)
                        .repository.save(t)),
            );
            expect(await svc.deleteLabtests(saved.map(s => s.id))).toStrictEqual(saved);
        });
    });
    describe('deletePrescriptions', () => {
        it('should return undefined', async () => {
            expect(await svc.deletePrescriptions()).toEqual(undefined);
        });

        it('should return the deleted prescriptions', async () => {
            const saved = await Promise.all(
                testing.prescriptionFactory.buildList(5)
                    .map(async (t) => await module.get<PrescriptionService>(PrescriptionService)
                        .repository.save(t)),
            );
            expect(await svc.deletePrescriptions(saved.map(s => s.id))).toStrictEqual(saved);
        });
    });
    describe('deleteReview', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteReview()).toEqual(undefined);
        });

        it('should return the deleted review', async () => {
            const review = testing.reviewFactory.build();
            module.get<ReviewService>(ReviewService).repository.save(review);
            expect(await svc.deleteReview(review.id)).toStrictEqual(review);
        });
    });

    describe('deleteConsultation', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteConsultation()).toEqual(undefined);
        });

        it('should return the deleted review', async () => {
            const consultation = testing.consultationFactory.build();
            module.get<ConsultationService>(ConsultationService).repository.save(consultation);
            expect(await svc.deleteConsultation(consultation.id)).toStrictEqual(consultation);
        });
    });

});
