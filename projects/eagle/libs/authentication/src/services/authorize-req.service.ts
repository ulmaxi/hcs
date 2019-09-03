import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  AuthorizeRequest,
  AccessLevel,
  AuthorizeResponse,
} from '@eagle/generated';
import { Authorization } from '../models/author.entity';
import { addMinutes, format } from 'date-fns';
import { AuthorService } from './author.service';
import { LoginService } from './login.service';
import { AuthorizeAlertService } from './authorize-alert.service';
import { v4 } from 'uuid';
import { Login } from '../models/login.entity';
import { generateOtp } from '@eagle/server-shared';

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
  async authorize({ accessLevel, identification }: AuthorizeRequest) {
    try {
      const author = await this.createOrRetrieve({
        accessLevel,
        identification,
      });
      const login = await this.registerlogin(author);
      this.alert.send(author, login);
      return {
        expires: login.expires,
        loginId: login.id,
      } as AuthorizeResponse;
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  /**
   * creates a new authorization or retrieves the intial one
   */
  async createOrRetrieve({ accessLevel, identification }: AuthorizeRequest) {
    let author = await this.author.findOne({ identification } as Partial<
      Authorization
    >);
    if (!author) {
      author = await this.author.repository.save(
        this.createDataRemap({ accessLevel, identification }),
      );
    }
    return author;
  }

  /**
   * maps the data to a certain format and access level
   */
  createDataRemap({
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
  registerlogin({ trackId, accessLevel }: Authorization) {
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
  otpExpires(access: AccessLevel) {
    return access < Institution ? 3 : 10;
  }

  
}
