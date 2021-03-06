import { ApiModelProperty } from '@nestjs/swagger';
import { Institution } from '@ulmax/ehr';
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
