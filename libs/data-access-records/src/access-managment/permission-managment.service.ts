import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isWithinRange } from 'date-fns';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
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
  public async verify(institution: string, clientId: string) {
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
  private filterAuthorizedPermission(
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
  public async request(institution: string, clientIdentification: string) {
    return await this.permCreator.create(institution, clientIdentification);
  }

  /**
   * authorize the institution with otp to access clientData
   */
  public async authorize(permissionId: string, code: number) {
    const perm = await this.permSvc.findOne({ id: permissionId, code });
    if (perm) {
      perm.authorized = true;
      return await this.permSvc.repository.save(perm);
    }
    throw permissionRequestAuthorizationError;
  }
}

/** error thrown when verifing permision */
export const permssionVerificationError = new UnauthorizedException(
  `Permission verification failed, request for new permission`,
);

/**
 * error throw when institution once to verify authorization to the system
 */
export const permissionRequestAuthorizationError = new UnauthorizedException(
  `The permission failed, probably due to incorrect otp code or trying to validate a wrong permission`,
);
