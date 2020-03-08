import { ApiModelProperty } from '@nestjs/swagger';
import { Prescription } from '@ulmax/ehr';

/**
 * The Drugs administered during a consultation
 */
export class ConsultatedDrug {
  /**
   * The name of the drug owner
   */
  @ApiModelProperty()
  owner: string;

  /**
   * The hospital which prescribed the drug
   */
  @ApiModelProperty()
  hopsital: string;

  /**
   * The various prescription during the consultations
   */
  @ApiModelProperty()
  prescriptions: Prescription[];

  @ApiModelProperty()
  date: Date;
}
