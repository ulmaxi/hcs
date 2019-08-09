import { AuthorizeRequestService } from '../services/authorize-req.service';
import { ValidateAuthorizedService } from '../services/validate-author.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query
  } from '@nestjs/common';
import {
  AuthorizeRequest,
  ValidateAuthorizationReq,
  AuthorizedEntity,
} from '@eagle/generated';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authorizer: AuthorizeRequestService,
    private validator: ValidateAuthorizedService,
  ) {}

  @Post('authorize')
  async authorize(@Body() loginReq: AuthorizeRequest) {
    return await this.authorizer.authorize(loginReq);
  }

  @Get('validate')
  async validate(@Query() otpLogin: ValidateAuthorizationReq) {
    const data = await this.validator.validate(otpLogin);
    const keys = await this.validator.securedKeys(data);
    const entity = new AuthorizedEntity({ keys, data });
    return entity;
  }

  @Get('verify')
  verify() {}
}
