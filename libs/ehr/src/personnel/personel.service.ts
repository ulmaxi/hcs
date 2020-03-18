import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization, AuthorizationCQREvents } from '@ulmax/authentication';
import { StaffService } from '../data-layer/staff/staff.service';
import { MicroService } from '@ulmax/microservice/shared';

@Injectable()
export class PersonnelService {
  constructor(
    @Inject(MicroService.Authorization) private readonly auth: ClientProxy,
    private staff: StaffService,
  ) {}

  /**
   * sends a microservice event to retrieve staff details
   */
  async retriveStaffID(institution: string, staffPhoneNo: string) {
    const trackId = await this.retriveTrackIdWithPhoneNo(staffPhoneNo);
    const staff = await this.staff.findOne(
      { trackID: trackId, institution },
      {},
    );
    if (!staff) {
      throw noStaffWithPhoneNoError(staffPhoneNo);
    }
    return staff.id;
  }

  /**
   * sends a microservice event to retrieve patient details
   */
  async retriveTrackIdWithPhoneNo(phoneNo: string) {
    const authReq = new AuthorizationCQREvents.RetriveEventQuery({
      where: { identification: phoneNo },
    });
    const authorization = await this.auth
      .send<Authorization>(authReq.action, authReq)
      .toPromise();
    if (!authorization) {
      throw noPersonnelError(phoneNo);
    }
    return authorization.trackId;
  }
}

/**
 * error when the staff is not found
 */
export const noStaffWithPhoneNoError = (phoneNo: string) =>
  new BadRequestException(
    `This institution has no staff with the phone No: ${phoneNo}, please register the staff`,
  );

/**
 * error thrown when the person is not found on the database
 */
export const noPersonnelError = (phoneNo: string) =>
  new BadRequestException(
    `No body registered on the global system with this phoneNo: ${phoneNo}, please register the person first`,
  );
