import { Test, TestingModule } from '@nestjs/testing';
import { admissionFactory, consultationFactory, labTestFactory, prescriptionFactory, reviewFactory, serviceFactoryMock, staffFactory } from '@ulmax/testing';
import { AdmissionService } from '../data-layer/admission/admission.service';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { LabTestService } from '../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../data-layer/prescription/prescription.service';
import { ReviewService } from '../data-layer/review/review.service';
import { StaffService } from '../data-layer/staff/staff.service';
import { CreateAdmission, CreateReview, FormatTrackedPlanToConsultation } from './interface';
import { UploadMedicalCareService } from './upload-medicare.service';

const mockedTrackedPlanBase: FormatTrackedPlanToConsultation = {
    consultation: consultationFactory.build(),
    institutionId: 'institutionId',
    trackId: 'trackId',
    plan: {
        patientId: 'patientId',
        staffId: 'staffId',
        admission: admissionFactory.build(),
        labTests: labTestFactory.buildList(3),
        prescriptions: prescriptionFactory.buildList(5),
        review: reviewFactory.build(),
    },
};
describe('UploadMedicalService', () => {
    let module: TestingModule;
    let svc: UploadMedicalCareService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                UploadMedicalCareService,
                { provide: AdmissionService, useValue: serviceFactoryMock({ factory: admissionFactory, preload: 5 }) },
                { provide: LabTestService, useValue: serviceFactoryMock({ factory: labTestFactory, preload: 5 }) },
                { provide: PrescriptionService, useValue: serviceFactoryMock({ factory: prescriptionFactory, preload: 5 }) },
                { provide: ReviewService, useValue: serviceFactoryMock({ factory: reviewFactory, preload: 5 }) },
                { provide: StaffService, useValue: serviceFactoryMock({ factory: staffFactory, preload: 5 }) },
                { provide: ConsultationService, useValue: serviceFactoryMock({ factory: consultationFactory, preload: 5 }) },
            ],
        }).compile();

        svc = module.get<UploadMedicalCareService>(UploadMedicalCareService);
    });

    describe('createAdmission', () => {
        it('should return undefined', async () => {
            expect(await svc.createAdmission(undefined)).toBe(undefined);
        });

        it('should return the newly created Admission', async () => {
            const consulationTrackId = 'consulationTrackId';
            const patientId = 'patientId';
            const admissionClaim = admissionFactory.build({ consulationTrackId: undefined, patientId: undefined });
            const arg: CreateAdmission = { consulationTrackId, patientId, admissionClaim };
            expect(await svc.createAdmission(arg)).toEqual({ ...admissionClaim, consulationTrackId, patientId });
        });
    });

    describe('createLabtest', () => {
        it('should return an empty array', async () => {
            expect(await svc.createLabtest()).toHaveLength(0);
        });

        it('should create lab tests from the lab claims', async () => {
            const requestedlabTests = labTestFactory.buildList(4);
            expect(await svc.createLabtest(requestedlabTests)).toEqual(requestedlabTests);
        });
    });

    describe('createPrescriptions', () => {
        it('should return an empty array', async () => {
            expect(await svc.createPrescriptions()).toHaveLength(0);
        });

        it('save create the prescriptions list', async () => {
            const prescriptions = prescriptionFactory.buildList(4);
            expect(await svc.createPrescriptions(prescriptions)).toStrictEqual(prescriptions);
        });
    });

    describe('createReview', () => {
        it('should return undefined', async () => {
            expect(await svc.createReview()).toBe(undefined);
        });

        it('should map and save the review', async () => {
            const reviewClaim = reviewFactory.build({
                admissionId: undefined,
                consulationTrackId: undefined,
                staffId: undefined,
            });
            const arg: CreateReview = {
                admissionId: 'admissionId',
                consulationTrackId: 'consulationTrackId',
                staffId: 'staffId',
                review: reviewClaim,
            };
            const { review, ...subKeys } = arg;
            expect(await svc.createReview(arg)).toStrictEqual({ ...reviewClaim, ...subKeys });
        });
    });

    describe('createConsultation', () => {
        it('should save the formated Plan', async () => {
            const expected = svc.formatTrackedMedicareToConsultation(mockedTrackedPlanBase);
            const result = await svc.createConsultation(mockedTrackedPlanBase);
            expect(result).toStrictEqual(expected);
        });

    });

    describe('formatTrackedMedicareToConsultation', () => {
        it('should default optional fields', () => {
            const arg: FormatTrackedPlanToConsultation = {
                ...mockedTrackedPlanBase, plan: {
                    ...mockedTrackedPlanBase.plan,
                    admission: undefined,
                    labTests: undefined,
                    prescriptions: undefined,
                },
            };
            const result = svc.formatTrackedMedicareToConsultation(arg);
            expect(result.admissionId).toBeUndefined();
            expect(result.labtests).toStrictEqual([]);
            expect(result.prescriptions).toStrictEqual([]);
        });
    });

});

