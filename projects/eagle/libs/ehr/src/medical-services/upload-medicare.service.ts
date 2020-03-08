import { Injectable } from '@nestjs/common';
import { UnsavedModel } from '@ulmax/server-shared';
import { AdmissionService } from '../data-layer/admission/admission.service';
import { Consultation } from '../data-layer/consultation/consultation.entity';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { LabTest } from '../data-layer/labtest/labtest.entity';
import { LabTestService } from '../data-layer/labtest/labtest.service';
import { Prescription } from '../data-layer/prescription/prescription.entity';
import { PrescriptionService } from '../data-layer/prescription/prescription.service';
import { ReviewService } from '../data-layer/review/review.service';
import { LabTestClaim, PrescriptionClaim } from '../util';
import { CreateAdmission, CreateReview, FormatTrackedPlanToConsultation } from './interface';

@Injectable()
export class UploadMedicalCareService {
  constructor(
    private consultation: ConsultationService,
    private admission: AdmissionService,
    private labTests: LabTestService,
    private prescription: PrescriptionService,
    private review: ReviewService,
  ) { }

  /**
   * sends a microservice event to create a new addmission
   */
  async createAdmission(admission?: CreateAdmission) {
    if (admission) {
      const { consulationTrackId, patientId, admissionClaim } = admission;
      return await this.admission.repository.save({
        ...admissionClaim,
        consulationTrackId,
        patientId,
      });
    }
    return undefined;
  }

  /**
   * sends a microservice event to create a new labtest
   */
  createLabtest(labTests?: LabTestClaim[]) {
    return labTests ? Promise.all(
      labTests.map(
        async (labTest) => await this.labTests.repository.save(labTest)),
    ) : Promise.resolve([] as LabTest[]);
  }

  /**
   * sends a microservice event to create a new precription
   */
  createPrescriptions(prescriptions?: PrescriptionClaim[]) {
    return prescriptions ? Promise.all(
      prescriptions.map(
        async (prescription) => await this.prescription.repository.save(prescription)),
    ) : Promise.resolve([] as Prescription[]);
  }

  /**
   * sends a microservice event to create a new review
   */
  async createReview(wardReview?: CreateReview) {
    if (wardReview) {
      const { review, admissionId, consulationTrackId, staffId } = wardReview;
      return await this.review.repository.save({
        ...review,
        admissionId, consulationTrackId, staffId,
      });
    }
    return undefined;
  }

  async createConsultation(plan: FormatTrackedPlanToConsultation) {
    return await this.consultation.repository
      .save(this.formatTrackedMedicareToConsultation(plan));
  }

  formatTrackedMedicareToConsultation(
    { institutionId, trackId, plan, consultation }:
      FormatTrackedPlanToConsultation) {
    return {
      ...consultation,
      institutionId,
      trackId,
      patientId: plan.patientId,
      consultantId: plan.staffId,
      admissionId: plan.admission?.id,
      labtests: plan?.labTests?.map(t => t.id) ?? [],
      prescriptions: plan.prescriptions?.map(t => t.id) ?? [],
    } as UnsavedModel<Consultation>;
  }

}
