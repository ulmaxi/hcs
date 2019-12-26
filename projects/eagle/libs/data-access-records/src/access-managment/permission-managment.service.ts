import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { isWithinRange } from 'date-fns';
import { PermissionCreatorService } from './permission-creator.service';

@Injectable()
export class PermissionManagmentService {
  constructor(
    private permSvc: PermissionRecordService,
    private permCreator: PermissionCreatorService,
  ) {}

  /**
   * checks if the instution is verified to access the client data
   */
  async verify(institution: string, clientId: string) {
    const perm = this.filterAuthorizedPermission(
      await this.permSvc.find({
        institution,
        clientId,
        authorized: true,
      }),
    );
    if (!perm) {
      throw permssionVerificationError;
    }
    return perm;
  }

  /**
   * checks for a recent permission given by client that has been
   * validated
   */
  filterAuthorizedPermission(
    perms: PermissionRecord[],
  ): null | PermissionRecord {
    let valid: PermissionRecord;
    for (const perm of perms) {
      if (isWithinRange(new Date(), perm.createdAt, perm.expires)) {
        valid = perm;
      }
    }
    return valid;
  }

  /**
   * request for a client to allow an organization to access their own data
   * TODO: change instution to its appropiate data format
   */
  async request(institution: string, clientIdentification: string) {
    return await this.permCreator.create(institution, clientIdentification);
  }

}

/** error thrown when verifing permision */
export const permssionVerificationError = new UnauthorizedException(
  `Permission verification failed, request for new permission`,
);
