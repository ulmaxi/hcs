import { AuthorService } from './author.service';
import { LoginService } from './login.service';
import { Authorization } from '../models/author.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { classToPlain } from 'class-transformer';
import { OTPValidationError } from '@eagle/server-shared';
import { ValidateAuthorizationReq, SecurityKeys } from '../controllers/typecast';

/**
 * validates the authorized otp and the Authorization details
 */
@Injectable()
export class ValidateAuthorizedService {
  constructor(
    private login: LoginService,
    private author: AuthorService,
    private jwt: JwtService,
  ) { }

  /**
   * validates the otp and sends the entity details
   */
  async validate({ id, otp }: ValidateAuthorizationReq) {
    const login = await this.login.findOne({
      id,
      otp: parseInt(otp.toString(), 10),
    });
    if (login) {
      return await this.author.findOne({
        trackId: login.trackingId,
      } as Partial<Authorization>);
    }
    throw OTPValidationError;
  }

  /**
   * generates a json web token and also sends the apikeys for appropiate
   */
  async securedKeys(data: Authorization) {
    const keys = new SecurityKeys();
    keys.apiKey = data.apiKey;
    keys.jwt = await this.jwt.signAsync(classToPlain(data));
    return keys;
  }

  /**
   * verifies the type of key if it's valid
   */
  async verifyKeys(keyFormat: string, key: string) {
    if (keyFormat.toLowerCase() === 'apikey') {
      return await this.author.findOne({ apiKey: key });
    }
    return await this.jwt.decode(key) as Authorization;
  }

}
