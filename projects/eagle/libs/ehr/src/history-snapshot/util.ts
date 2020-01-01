// tslint:disable: max-classes-per-file
import { Consultation } from '../data-layer/consultation/consultation.entity';
import { BaseModel, List } from '@eagle/server-shared';
import { Institution } from '../data-layer/institution/institution.entity';
import { Prescription } from '../data-layer/prescription/prescription.entity';
import { LabTest } from '../data-layer/labtest/labtest.entity';
import { Admission } from '../data-layer/admission/admission.entity';

/**
 * The whole representation of a full consultation
 */
export class ConsulationGraphSnaphot {
    /**
     * The initial consultation
     */
    intital: ConsultationSnapshot;
    /**
     * sorted progression of followup consultations
     */
    followUps: ConsultationSnapshot[];
}

export class ConsultationSnapshot extends BaseModel {
    /**
     * the unique id for each consutation which must be generated.
     */
    id: string;

    /**
     * a unique id create for the first consultation on an illness,
     * other consultations shares it and can track all consultaion
     * pertaning to that illness.
     */
    trackId: string;

    /**
     * the institutiton details
     */
    institution: Institution;

    /**
     * details about the attending consultant.
     */
    consultant: MiniConsultantDetails;

    /**
     * The patients actual complains.
     */
    complain: string;

    /**
     * the consultant diagonis of the illness.
     */
    diagnosis: string;

    /**
     * the doctor's procedure for treatment.
     */
    planAndProcedure: string;

    /**
     * an array of unique for prescription for the consulation.
     * which is used for retrival
     */
    prescriptions: List<Prescription> = [];

    /**
     * an array of unique ids for laboratory tests.
     * which is used for retrieval
     */
    labtests: List<LabTest> = [];

    /**
     * admission in the health insitution
     * if it exist the patient is an in-patient
     */
    admission: Admission;
}

/**
 * mini representation for the consultant
 */
export class MiniConsultantDetails {
    id: string;
    name: string;
    phoneNo: string;
    field: string;
    department: string;
}
