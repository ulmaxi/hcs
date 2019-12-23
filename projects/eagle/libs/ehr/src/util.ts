// tslint:disable: max-classes-per-file
import { Consultation, Admission, LabTest, Prescription, Review } from '@eagle/ehr';
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
    staffPhoneNo: string;

    /**
     * The patient phone number
     */
    @IsDefined()
    patientPhoneNo: string;

    /**
     * medical consultations
     */
    @IsDefined()
    consultation: ConsultationClaim;

    /**
     * admission informations
     */
    @IsOptional()
    admission?: AdmissionClaim;

    /**
     * various tests required
     */
    @IsOptional()
    labTests?: LabTestClaim[];

    /**
     * various prescriptions for the patient
     */
    @IsOptional()
    prescriptions?: PrescriptionClaim[];

    /**
     * consultant review of the patient in the ward
     */
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
    staffId: string;
    /**
     * The patient phone number
     */
    patientId: string;
    /**
     * full information about consultation
     */
    consultation: Consultation;
    /**
     * full information about admission
     */
    admission?: Admission;
    /**
     * full information about lab tests
     */
    labTests?: LabTest[];
    /**
     * full information about prescriptions
     */
    prescriptions?: Prescription[];
    /**
     * full informations about the review
     */
    review?: Review;
}
