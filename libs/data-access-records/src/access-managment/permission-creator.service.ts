import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import  type { Authorization } from '@ulmax/authentication';
import type { UlmaxCard } from '@ulmax/cardnode';
import  type { Institution } from '@ulmax/ehr';
import { generateOtp, MessageEvents, microServiceToken, SendSMSEvent } from '@ulmax/server-shared';
import { addMonths } from 'date-fns';
import { combineLatest, of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';

/**
 * Alert OTP address information interface
 */
export interface OTPAddress {
  cardNo: string;
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
    @Inject(microServiceToken) private readonly transport: ClientProxy,
  ) {}

  /**
   * creates a new permission for a client to allow
   * an organization to access their __own data__
   * TODO: change instution to its appropiate data format
   */
  public async create(institution: string, identification: string) {
    const [institutionData, auth, card] = await this.retriveInParrallel(
      institution,
      identification,
    ).toPromise();
    return await this.saveAndAlertRequest(card.id, {
      cardNo: card.cardNo,
      clientPhoneNo: auth.identification,
      institutionId: institution,
      institutionName: institutionData.name,
    });
  }

  /**
   * retrieves the client and instution details in parallel
   */
  private retriveInParrallel(institution: string, identification: string) {
    // retrieve institutionData
    const institutionData$ = this.retriveInstitution({ trackId: institution });
    // retrieve clientAuthData
    const authAndCard$ = this.retriveAuthorizationAndCard(identification);
    return combineLatest(institutionData$, authAndCard$).pipe(
      map(
        ([instituiton, [auth, card]]) =>
          [instituiton, auth, card] as [Institution, Authorization, UlmaxCard],
      ),
    );
  }

  /**
   * retrieves the institution throw micro service
   */
  private retriveInstitution(query: Partial<Institution>) {
    return this.transport
      .send<Institution>('', query)
      .pipe(
        map(instituiton =>
          this.nullThrowError(instituiton, institutionRequestError),
        ),
      );
  }

  /**
   * throws error if that is invalid else returns it
   */
  private nullThrowError<T>(data: T, error: HttpException) {
    if (!data) {
      throw authRequestError;
    }
    return data;
  }

  /**
   * retrieves both the authorization and card of the
   * user.
   */
  private retriveAuthorizationAndCard(identification: string) {
    // validate phoneNoHere
    const isPhoneNo = true;
    return isPhoneNo
      ? this.retriveBiodatawithPhoneNo(identification)
      : this.retriveAuthWithCardNo(identification);
  }

  /**
   * retrieves both but used the to retrieve the card
   */
  private retriveBiodatawithPhoneNo(identification: string) {
    return this.retrieveAuth({ identification }).pipe(
      exhaustMap(auth => {
        return combineLatest(
          of(auth),
          this.retrieveCardNode({ trackId: auth.trackId }),
        );
      }),
    );
  }

  /**
   * retrieves the card with the phoneNo and also the Auth info
   */
  private retriveAuthWithCardNo(cardNo: string) {
    return this.retrieveCardNode({ cardNo })
      .pipe(
        exhaustMap(card => {
          return combineLatest(
            of(card),
            this.retrieveAuth({ trackId: card.trackId }),
          );
        }),
      )
      .pipe(map(([card, auth]) => [auth, card]));
  }

  /**
   * retrieves the auth with microservice
   */
  private retrieveAuth(query: Partial<Authorization>) {
    return this.transport
      .send<Authorization>('', query)
      .pipe(map(auth => this.nullThrowError(auth, authRequestError)));
  }
  /**
   * retrieves th client biodata throws an execption if it doesn't exist
   */
  private retrieveCardNode(query: Partial<UlmaxCard>) {
    return this.transport
      .send<UlmaxCard>('', query)
      .pipe(map(card => this.nullThrowError(card, cardNodeRequestError)));
  }

  /**
   * saves and alert the
   */
  private async saveAndAlertRequest(cardId: string, otpReq: OTPAddress) {
    const perm = await this.saveNewPermission(otpReq.institutionId, cardId);
    this.alertOtp({ ...otpReq, code: perm.code });
    return perm;
  }

  /**
   * saves the newly generated service to database
   */
  private saveNewPermission(institution: string, cardId: string) {
    return this.permSvc.repository.save(
      this.generateNewPermission(institution, cardId),
    );
  }

  /**
   * a factory function to create a new permission.
   */
  private generateNewPermission(institution: string, cardId: string) {
    const perm = new PermissionRecord();
    perm.clientId = cardId;
    perm.code = generateOtp();
    perm.institution = institution;
    perm.expires = addMonths(new Date(), 3);
    return perm;
  }

  /**
   * sends the authorization code to the client to allow
   * institution to have access to their records
   */
  private alertOtp({ cardNo, clientPhoneNo, code, institutionName }: AlertOtp) {
    const message = `${institutionName} is requesting access to your health card ${cardNo},
    confirm with ${code}. Thank you.`;
    this.transport.emit(
      MessageEvents.SMS,
      new SendSMSEvent(clientPhoneNo, message),
    );
  }
}

/**
 * error throw when user doesn't exist in the system
 */
export const institutionRequestError = new BadRequestException(
  `The instution with this permission doesn't exist [data-access-record]`,
);

/**
 * error throw when user doesn't exist in the system
 */
export const authRequestError = new BadRequestException(
  `The client requesting permission for doesn't exist on the system register first [data-access-record]`,
);

/**
 * error throw when Ulmax doesn't exist in the system
 */
export const cardNodeRequestError = new BadRequestException(
  `The ulmax card node doesn't exit [data-access-record]`,
);
