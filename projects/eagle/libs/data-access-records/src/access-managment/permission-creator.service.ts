import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from '@ulmax/authentication';
import { generateOtp, MessageEvents, microServiceToken, SendSMSEvent } from '@ulmax/server-shared';
import { addMonths } from 'date-fns';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { DataRetrievalService } from './data-retrieval.service';

/**
 * Alert OTP address information interface
 */
export interface OTPAddress {
  clientName: string;
  clientPhoneNo: string;
  institutionName: string;
  institutionId: string;
}

/**
 * Alert OTP interface
 */
export interface AlertOtp extends OTPAddress {
  code: number;
}

/**
 * PermissionCreatorService is responsible for
 * creating a new permission for an instituiton
 */
@Injectable()
export class PermissionCreatorService {
  constructor(
    private permSvc: PermissionRecordService,
    private transport: DataRetrievalService,
    @Inject(microServiceToken) private readonly client: ClientProxy,
  ) { }

    /**
     * creates a new permission for a client to allow
     * an organization to access their __own data__
     * TODO: change instution to its appropiate data format
     */
  async create(institution: string, clientIdentification: string) {
    const institutionData = await this.transport.retrieveInstitution({
      trackId: institution,
    });
    const clientAuth = await this.transport.retrieveAuth({
      identification: clientIdentification,
    });
    const biodata = await this.retrieveBiodata(clientAuth);
    if (institution && clientAuth && biodata) {
      return await this.saveAndAlertRequest({
        clientName: `${biodata.firstname} ${biodata.lastname}`,
        clientPhoneNo: clientIdentification,
        institutionId: institution,
        institutionName: institutionData.name,
      });
    }
    throw permissionRequestDetailError;
  }

  /**
   * retrieves th client biodata throws an execption if it doesn't exist
   */
  async retrieveBiodata(clientAuth: Authorization) {
    if (clientAuth && clientAuth.trackId) {
      const biodata = await this.transport.retrievePersonalBiodata({
        trackId: clientAuth.trackId,
      });
      if (biodata) {
        return biodata;
      }
    }
    throw permissionRequestUserError;
  }

  /**
   * saves and alert the
   */
  async saveAndAlertRequest(otpReq: OTPAddress) {
    const perm = await this.saveNewPermission(
      otpReq.institutionId,
      otpReq.clientPhoneNo,
    );
    this.alertOtp({ ...otpReq, code: perm.code });
    return perm;
  }

  /**
   * saves the newly generated service to database
   */
  saveNewPermission(institution: string, clientIdentification: string) {
    return this.permSvc.repository.save(
      this.generateNewPermission(institution, clientIdentification),
    );
  }

  /**
   * a factory function to create a new permission.
   */
  generateNewPermission(institution: string, clientId: string) {
    const perm = new PermissionRecord();
    perm.clientId = clientId;
    perm.code = generateOtp();
    perm.institution = institution;
    perm.expires = addMonths(new Date(), 3);
    return perm;
  }

  /**
   * sends the authorization code to the client to allow
   * institution to have access to their records
   */
  alertOtp({ clientName, clientPhoneNo, code, institutionName }: AlertOtp) {
    const message = `${clientName}, ${institutionName} is requesting access to your health records,
    confirm with ${code}. Thank you.`;
    this.client.emit(
      MessageEvents.SMS,
      new SendSMSEvent(clientPhoneNo, message),
    );
  }

  /**
   * authorize the institution with otp to access clientData
   */
  async authorize(permissionId: string, code: number) {
    const perm = await this.permSvc.findOne({ id: permissionId, code });
    if (perm) {
      perm.authorized = true;
      return await this.permSvc.repository.save(perm);
    }
    throw permissionRequestAuthorizationError;
  }
}

/** error thrown when requesting permission and required datas are incomplete */
export const permissionRequestDetailError = new BadRequestException(
  `invalid data was sent, probably check client identification`,
);

/**
 * error throw when user doesn't exist in the system
 */
export const permissionRequestUserError = new BadRequestException(
  `The client requesting permission for doesn't exist on the system register first`,
);

/**
 * error throw when institution once to verify authorization to the system
 */
export const permissionRequestAuthorizationError = new UnauthorizedException(
  `The permission failed, probably due to incorrect otp code or trying to validate a wrong permission`,
);
