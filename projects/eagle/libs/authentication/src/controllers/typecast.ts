// tslint:disable: max-classes-per-file
import * as generated from '@eagle/generated';
import { Authorization } from '../models/author.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export class AuthorizeRequest implements generated.AuthorizeRequest {
  @IsOptional()
  // @ApiModelPropertyOptional({ enum: ['Admin', 'Moderator', 'User'] })
  public accessLevel: generated.AccessLevel;

  @ApiModelProperty({
    required: true,
    description: `
  unique identification for the insitution or user which can either be a phoneNo or email address`,
  })
  @IsDefined()
  public identification: string;
}

export class ValidateAuthorizationReq
  implements generated.ValidateAuthorizationReq {
  @IsDefined()
  @ApiModelProperty({
    required: true,
    description: `The id sent for the authorization request`,
  })
  public id: string;

  @IsDefined()
  @ApiModelProperty({
    required: true,
    description: `The OTP code sent to the user for confirmation`,
  })
  public otp: number;
}

export class AuthorizedEntity implements generated.AuthorizedEntity {
  @ApiModelProperty({
    required: true,
    description: `The details of the user authenticated`,
  })
  public data: Authorization;
  @ApiModelProperty({
    required: true,
    description: `Secured keys both jwt and apikey used for request validation`,
  })
  public keys: generated.SecurityKeys;
}

export class KeyVerfication implements generated.KeyVerification {
  @ApiModelProperty({
    required: true,
    enum: ['apikey', 'jwt'],
    description: `The type of key to be validated`,
  })
  public format: string;

  @ApiModelProperty({
    required: true,
    description: `The key to be validated`,
  })
  public key: string;
}
