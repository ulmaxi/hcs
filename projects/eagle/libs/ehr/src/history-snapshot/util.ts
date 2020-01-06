// tslint:disable: max-classes-per-file
import { BaseModel, List } from '@eagle/server-shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Admission } from '../data-layer/admission/admission.entity';
import { Consultation } from '../data-layer/consultation/consultation.entity';
import { Institution } from '../data-layer/institution/institution.entity';
import { LabTest } from '../data-layer/labtest/labtest.entity';
import { Prescription } from '../data-layer/prescription/prescription.entity';

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

export class ConsultationSnapshot extends BaseModel {
  /**
   * the unique id for each consutation which must be generated.
   */
  @ApiModelProperty()
  id: string;

  /**
   * a unique id create for the first consultation on an illness,
   * other consultations shares it and can track all consultaion
   * pertaning to that illness.
   */
  @ApiModelProperty()
  trackId: string;

  /**
   * the institutiton details
   */
  @ApiModelProperty()
  institution: Institution;

  /**
   * details about the attending consultant.
   */
  @ApiModelProperty()
  consultant: MiniConsultantDetails;

  /**
   * The patients actual complains.
   */
  @ApiModelProperty()
  complain: string;

  /**
   * the consultant diagonis of the illness.
   */
  @ApiModelProperty()
  diagnosis: string;

  /**
   * the doctor's procedure for treatment.
   */
  @ApiModelProperty()
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
  @ApiModelPropertyOptional()
  admission?: Admission;
}

export class FilterOptions {
  @ApiModelProperty({
    description: 'how many consultation trees should it return',
  })
  depth: number;

  @ApiModelProperty({
    description: 'how many consultation trees should it skip',
  })
  skip: number;
}

/**
 * the interface for send request through
 * microservices to query consultation
 */
export class ReqMicroHistorySnapshot {
  /**
   * the query to narrow than the request
   */
  query: Partial<Consultation>;
  /**
   * config skip and take(limit)
   */
  config: Partial<FilterOptions>;
}
