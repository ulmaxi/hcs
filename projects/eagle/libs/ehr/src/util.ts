// tslint:disable: max-classes-per-file
import { Admission, Consultation, LabTest, Prescription, Review } from '@eagle/ehr';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export type ConsultationClaim = Pick<Consultation, 'complain' | 'diagnosis' | 'planAndProcedure'>;
export type AdmissionClaim = Pick<Admission, 'ward' | 'isDischarged'>;
export type LabTestClaim = Pick<LabTest, 'type' | 'results' | 'images'>;
export type PrescriptionClaim = Pick<Prescription, 'name' | 'dosage' | 'time'>;
export type ReviewClaim = Pick<Review, 'department' | 'note'>;

/**
 * informations about the incoming medical care for the patient
 */
export class MedicalCarePlan {
  /**
   * the uniqueId for the staff
   */
  @IsDefined()
  @ApiModelProperty()
  staffPhoneNo: string;

  /**
   * The patient phone number
   */
  @ApiModelProperty()
  @IsDefined()
  patientPhoneNo: string;

  /**
   * medical consultations
   */
  @ApiModelProperty()
  @IsDefined()
  consultation: ConsultationClaim;

  /**
   * admission informations
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  admission?: AdmissionClaim;

  /**
   * various tests required
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  labTests?: LabTestClaim[];

  /**
   * various prescriptions for the patient
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  prescriptions?: PrescriptionClaim[];

  /**
   * consultant review of the patient in the ward
   */
  @ApiModelPropertyOptional()
  @IsOptional()
  review?: ReviewClaim;
}

/**
 * full details about the saved medical planned
 */
export class TrackedMedicalCarePlan {
  /**
   * the uniqueId for the staff
   */
  @ApiModelProperty()
  staffId: string;
  /**
   * The patient phone number
   */
  @ApiModelProperty()
  patientId: string;
  /**
   * full information about consultation
   */
  @ApiModelProperty()
  consultation: Consultation;
  /**
   * full information about admission
   */
  @ApiModelPropertyOptional()
  admission?: Admission;
  /**
   * full information about lab tests
   */
  @ApiModelPropertyOptional()
  labTests?: LabTest[];
  /**
   * full information about prescriptions
   */
  @ApiModelPropertyOptional()
  prescriptions?: Prescription[];
  /**
   * full informations about the review
   */
  @ApiModelPropertyOptional()
  review?: Review;
}
