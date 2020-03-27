import { Body, Controller, Post } from '@nestjs/common';
import { Authorization, Authorized } from '@ulmax/authentication';
import { RegisterStaffDetails } from './register-staff';
import { StaffManagmentService } from './staff-management.service';

@Controller('personnel')
export class PersonelController {
  constructor(private management: StaffManagmentService) {}

  /**
   * registers the staff to the health institution
   */
  @Post('register')
  register(
    @Authorized() { trackId }: Authorization,
    @Body() staffDetails: RegisterStaffDetails,
  ) {
    return this.management.register(trackId, staffDetails);
  }

  /**
   * revokes the staff from the institution
   */
  @Post('revoke')
  revoke(
    @Authorized() { trackId }: Authorization,
    @Body() staffDetails: Pick<RegisterStaffDetails, 'staffPhoneNo'>,
  ) {
    return this.management.revoke(trackId, staffDetails.staffPhoneNo);
  }
}
