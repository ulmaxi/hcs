import { Institution } from '@eagle/ehr';
import { ApiModelProperty } from '@nestjs/swagger';
import { Emergency } from '../models/emergency.entity';

/**
 * The response for emergency request by the public
 */
export class EmergencyResponse {
  /**
   * saved emergency information
   */
  @ApiModelProperty()
  emergency: Emergency;
  /**
   * pit information about the instituion
   */
  @ApiModelProperty()
  institution: Institution | Omit<Institution, 'id' | 'trackId' | 'zipcode'>;
}
