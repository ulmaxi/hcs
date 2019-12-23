import { Controller, Get, Body } from '@nestjs/common';
import { StaffManagmentService } from './staff-management.service';
import { Authorized } from '@eagle/server-shared';
import { Authorization } from '@eagle/generated';
import { RegisterStaffDetails } from './register-staff';

@Controller('personnel')
export class PersonelController {
    constructor(private management: StaffManagmentService) { }

    /**
     * registers the staff to the health institution
     */
    register(
        @Authorized() { trackId }: Authorization,
        @Body() staffDetails: RegisterStaffDetails,
    ) {
        return this.management.register(trackId, staffDetails);
    }

    /**
     * revokes the staff from the institution
     */
    revoke(
        @Authorized() { trackId }: Authorization,
        @Body() staffDetails: Pick<RegisterStaffDetails, 'staffPhoneNo'>,
    ) {
        return this.management.revoke(trackId, staffDetails.staffPhoneNo);
     }
}
