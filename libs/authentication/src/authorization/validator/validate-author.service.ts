import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OTPValidationError } from '@ulmax/server-shared';
import { classToPlain } from 'class-transformer';
import { Authorization } from '../../data-layer/author/author.entity';
import { AuthorService } from '../../data-layer/author/author.service';
import { LoginService } from '../../data-layer/login/login.service';
import { SecurityKeys, ValidateAuthorizationReq } from '../authorizer/typecast';
import { AuthorizedEventService } from './authorized-events.service';

/**
 * validates the authorized otp and the Authorization details
 */
@Injectable()
export class ValidateAuthorizedService {
  constructor(
    private login: LoginService,
    private author: AuthorService,
    private jwt: JwtService,
    private event: AuthorizedEventService,
  ) {}

  /**
   * validates the otp and sends the entity details
   */
  public async validate({ id, otp, registering }: ValidateAuthorizationReq) {
    const login = await this.login.findOne({
      id,
      otp: parseInt(otp.toString(), 10),
    });
    if (login) {
      const author = await this.author.findOne({
        trackId: login.trackingId,
      } as Partial<Authorization>);
      this.event.trigger(author, registering);
      return author;
    }
    throw OTPValidationError;
  }

  /**
   * generates a json web token and also sends the apikeys for appropiate
   */
  public async securedKeys(data: Authorization) {
    const keys = new SecurityKeys();
    keys.apiKey = data.apiKey;
    keys.jwt = await this.jwt.signAsync(classToPlain(data));
    return keys;
  }

  /**
   * verifies the type of key if it's valid
   */
  public async verifyKeys(keyFormat: string, key: string) {
    if (keyFormat.toLowerCase() === 'apikey') {
      return await this.author.findOne({ apiKey: key });
    }
    return (await this.jwt.decode(key)) as Authorization;
  }
}
