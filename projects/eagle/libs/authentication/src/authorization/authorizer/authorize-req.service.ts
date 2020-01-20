import { Injectable, UnauthorizedException } from '@nestjs/common';
import { generateOtp } from '@ulmax/server-shared';
import { addMinutes, format } from 'date-fns';
import { v4 } from 'uuid';
import { AccessLevel, Authorization } from '../../data-layer/author/author.entity';
import { AuthorService } from '../../data-layer/author/author.service';
import { Login } from '../../data-layer/login/login.entity';
import { LoginService } from '../../data-layer/login/login.service';
import { AuthorizeAlertService } from './authorize-alert.service';
import { AuthorizeRequest, AuthorizeResponse } from './typecast';

const { Institution, SuperAdmin, Users } = AccessLevel;

/**
 * Handles the inital authentication request for any entity
 */
@Injectable()
export class AuthorizeRequestService {
  constructor(
    private author: AuthorService,
    private login: LoginService,
    private alert: AuthorizeAlertService,
  ) {}

  /**
   * authorizes the request either new or recent for send validation
   */
  async authorize(
    { accessLevel, identification }: AuthorizeRequest,
    regiserIfNotFound = false,
  ) {
    try {
      const author = await this.createOrRetrieve(
        {
          accessLevel,
          identification,
        },
        regiserIfNotFound,
      );
      return this.authorizeResponse(author);
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }

  /**
   * formats and creates a authorize response to the client requesting authorization.
   */
  private async authorizeResponse(author: Authorization) {
    const login = await this.registerlogin(author);
    this.alert.send(author, login);
    return {
      expires: login.expires,
      loginId: login.id,
    } as AuthorizeResponse;
  }

  /**
   * creates a new authorization or retrieves the intial one
   */
  private async createOrRetrieve(
    { accessLevel, identification }: AuthorizeRequest,
    regiserIfNotFound: boolean,
  ) {
    let author = await this.author.findOne({ identification } as Partial<
      Authorization
    >);
    if (!author && regiserIfNotFound) {
      author = await this.author.repository.save(
        this.createDataRemap({ accessLevel, identification }),
      );
    }
    if (author) {
      return author;
    }
    throw InvalidAuthCredentialsError;
  }

  /**
   * maps the data to a certain format and access level
   */
  private createDataRemap({
    accessLevel,
    identification,
  }: AuthorizeRequest): Partial<Authorization> {
    if (!accessLevel || accessLevel === SuperAdmin) {
      accessLevel = Users;
    }
    const newAuthor = new Authorization();
    newAuthor.accessLevel = accessLevel;
    newAuthor.identification = identification;
    newAuthor.trackId = v4();
    return newAuthor;
  }

  /**
   * creates a record of the login which is used for validation
   */
  private registerlogin({ trackId, accessLevel }: Authorization) {
    const login = new Login();
    login.id = v4();
    login.otp = generateOtp();
    login.trackingId = trackId;
    login.expires = Number(
      format(addMinutes(Date.now(), this.otpExpires(accessLevel)), 'x'),
    );
    return this.login.repository.save(login);
  }

  /**
   * added time in minutes before otp expires
   */
  public otpExpires(access: AccessLevel) {
    return access < Institution ? 3 : 10;
  }
}

/**
 * error when the user authorization is not found for the user.
 */
export const InvalidAuthCredentialsError = new UnauthorizedException(
  'Invalid authorization credientials provided, reconfirm!',
);
