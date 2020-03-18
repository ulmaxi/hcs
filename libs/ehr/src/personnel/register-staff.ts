import { Staff } from '../data-layer/staff/staff.entity';
import { IsDefined } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class RegisterStaffDetails
  implements Pick<Staff, 'field' | 'department' | 'institution'> {
  @IsDefined()
  @ApiModelProperty({ description: `The phoneNo of the staff` })
  staffPhoneNo: string;

  @IsDefined()
  @ApiModelProperty({ description: `The field of the staff` })
  field: string;

  @IsDefined()
  @ApiModelPropertyOptional({
    description: `The department of the staff in the institution`,
  })
  department: string;

  @IsDefined()
  @ApiModelProperty({ description: `The unique id for the institution` })
  institution: string;
}
