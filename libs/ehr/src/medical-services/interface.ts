import {
  AdmissionClaim,
  ConsultationClaim,
  ReviewClaim,
  TrackedMedicalCarePlan,
} from '../util';

export interface CreateAdmission {
  consulationTrackId: string;
  patientId: string;
  admissionClaim: AdmissionClaim;
}

export interface CreateReview {
  review: ReviewClaim;
  admissionId: string;
  consulationTrackId: string;
  staffId: string;
}

export interface FormatTrackedPlanToConsultation {
  institutionId: string;
  trackId: string;
  plan: Omit<TrackedMedicalCarePlan, 'consultation'>;
  consultation: ConsultationClaim;
}
