import { TestingModule, Test } from '@nestjs/testing';
import { RevokeMedicalCarePlanService } from './revoke-medical-care.service';
import { AdmissionService } from '../data-layer/admission/admission.service';
import {
    serviceFactoryMock,
    admissionFactory,
    labTestFactory,
    prescriptionFactory,
    reviewFactory,
    staffFactory,
    consultationFactory,
} from '@eagle/testing';
import { LabTestService } from '../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../data-layer/prescription/prescription.service';
import { ReviewService } from '../data-layer/review/review.service';
import { StaffService } from '../data-layer/staff/staff.service';
import { ConsultationService } from '../data-layer/consultation/consultation.service';

describe('RevokeMedicalClaimService', () => {
    let module: TestingModule;
    let svc: RevokeMedicalCarePlanService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                RevokeMedicalCarePlanService,
                { provide: AdmissionService, useValue: serviceFactoryMock({ factory: admissionFactory, preload: 5 }) },
                { provide: LabTestService, useValue: serviceFactoryMock({ factory: labTestFactory, preload: 5 }) },
                { provide: PrescriptionService, useValue: serviceFactoryMock({ factory: prescriptionFactory, preload: 5 }) },
                { provide: ReviewService, useValue: serviceFactoryMock({ factory: reviewFactory, preload: 5 }) },
                { provide: StaffService, useValue: serviceFactoryMock({ factory: staffFactory, preload: 5 }) },
                { provide: ConsultationService, useValue: serviceFactoryMock({ factory: consultationFactory, preload: 5 }) },
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
                .repository.save(admissionFactory.build());
            expect(await svc.deleteAdmission(admission.id)).toStrictEqual(admission);
        });
    });
    describe('deleteLabtests', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteLabtests()).toEqual(undefined);
        });

        it('should return the deleted labtests', async () => {
            const saved = await Promise.all(
                labTestFactory.buildList(5)
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
                prescriptionFactory.buildList(5)
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
            const review = reviewFactory.build();
            module.get<ReviewService>(ReviewService).repository.save(review);
            expect(await svc.deleteReview(review.id)).toStrictEqual(review);
        });
    });

    describe('deleteConsultation', () => {
        it('should return undefined', async () => {
            expect(await svc.deleteConsultation()).toEqual(undefined);
        });

        it('should return the deleted review', async () => {
            const consultation = consultationFactory.build();
            module.get<ConsultationService>(ConsultationService).repository.save(consultation);
            expect(await svc.deleteConsultation(consultation.id)).toStrictEqual(consultation);
        });
    });

});
