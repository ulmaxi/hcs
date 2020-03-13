import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PersonnelService, noStaffWithPhoneNoError } from './personel.service';
import { StaffService } from '../data-layer/staff/staff.service';
import { Staff } from '../data-layer/staff/staff.entity';
import { RegisterStaffDetails } from './register-staff';

@Injectable()
export class StaffManagmentService {
    constructor(
        private personnel: PersonnelService,
        private staff: StaffService,
    ) { }

    /**
     * registers the staff with phone to the institution
     */
    async register(institution: string, { staffPhoneNo, ...details }: RegisterStaffDetails) {
        const trackID = await this.personnel.retriveTrackIdWithPhoneNo(staffPhoneNo);
        let staff = await this.staff.findOne({ institution, trackID } as Partial<Staff>);
        if (staff && !staff.revoked) {
            throw staffAlreadyRegisteredError(staffPhoneNo);
        }
        staff = await this.staff.repository.
            save({ ...details, institution, trackID, revoked: false });
        return staff;
    }

    /**
     * revokes the staff access to the institution
     */
    async revoke(institution: string, staffPhoneNo: string) {
        const trackID = await this.personnel.retriveTrackIdWithPhoneNo(staffPhoneNo);
        let staff = await this.staff.findOne({ institution, trackID } as Partial<Staff>);
        if (!staff) {
            throw noStaffWithPhoneNoError(staffPhoneNo);
        }
        staff.revoked = true;
        staff = await this.staff.repository.save(staff);
        return staff;
    }

}

/**
 * throws error if the staff had already being registered.
 */
export const staffAlreadyRegisteredError = (staffPhoneNo: string) => new UnprocessableEntityException(
    `The staff with ${staffPhoneNo} has already being registered to this institution`,
);

/**
 * error thrown if an attempt to revoke a staff who never was registered to the institution
 */
export const staffNeverRegisteredError = (staffPhoneNo: string) => new UnprocessableEntityException(
    `The personnel with ${staffPhoneNo} was never registered to this institution`,
);
