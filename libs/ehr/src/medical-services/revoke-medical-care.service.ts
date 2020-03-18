import { Injectable } from '@nestjs/common';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { AdmissionService } from '../data-layer/admission/admission.service';
import { LabTestService } from '../data-layer/labtest/labtest.service';
import { PrescriptionService } from '../data-layer/prescription/prescription.service';
import { ReviewService } from '../data-layer/review/review.service';
import { Admission } from '../data-layer/admission/admission.entity';
import { LabTest } from '../data-layer/labtest/labtest.entity';
import { Prescription } from '../data-layer/prescription/prescription.entity';
import { Review } from '../data-layer/review/review.entity';
import { Consultation } from '../data-layer/consultation/consultation.entity';

/**
 * The type for result for deleting
 */
type RevokedResult<T> = Promise<T | undefined>;

@Injectable()
export class RevokeMedicalCarePlanService {
  constructor(
    private consultation: ConsultationService,
    private admission: AdmissionService,
    private labTests: LabTestService,
    private prescription: PrescriptionService,
    private review: ReviewService,
  ) {}

  /**
   * removed the saved admission
   */
  async deleteAdmission(id?: string): RevokedResult<Admission> {
    if (id) {
      const [deleted] = await this.admission.repository.remove({ id } as any);
      return deleted;
    }
  }

  /**
   * removed the saved lab tests
   */
  async deleteLabtests(ids?: string[]): RevokedResult<LabTest[]> {
    if (ids) {
      const deleted = await this.labTests.repository.remove(ids.map(id => ({
        id,
      })) as any);
      return deleted;
    }
  }
  /**
   * removed the saved prescriptions
   */
  async deletePrescriptions(ids?: string[]): RevokedResult<Prescription[]> {
    if (ids) {
      const deleted = await this.prescription.repository.remove(ids.map(id => ({
        id,
      })) as any);
      return deleted;
    }
  }

  /**
   * removed the saved review
   */
  async deleteReview(id?: string): RevokedResult<Review> {
    if (id) {
      const [deleted] = await this.review.repository.remove({ id } as any);
      return deleted;
    }
  }

  /**
   * removed the saved consultation
   */
  async deleteConsultation(id?: string): RevokedResult<Consultation> {
    if (id) {
      const [deleted] = await this.consultation.repository.remove({
        id,
      } as any);
      return deleted;
    }
  }
}
