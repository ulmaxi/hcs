// tslint:disable: max-classes-per-file
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import { AccessLevel, Authorization } from '../../data-layer/author/author.entity';

export class AuthorizeRequest {
  @IsOptional()
  // @ApiModelPropertyOptional({ enum: ['Admin', 'Moderator', 'User'] })
  public accessLevel: AccessLevel;

  @ApiModelProperty({
    required: true,
    description: `
  unique identification for the insitution or user which can either be a phoneNo or email address`,
  })
  @IsDefined()
  public identification: string;
}

export class ValidateAuthorizationReq {
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

  @IsDefined()
  @ApiModelProperty({
    required: false,
    description: `Confirms if the user is just registering`,
  })
  public registering: boolean = false;
}

/** The keys for security means */
export class SecurityKeys {
  /** jwt for the authorized authentication which encrypts the Authorization */
  public jwt: string;

  /** optional and only available for institutions for api requests */
  public apiKey: string;
}

export class AuthorizedEntity {
  @ApiModelProperty({
    required: true,
    description: `The details of the user authenticated`,
  })
  public data: Authorization;
  @ApiModelProperty({
    required: true,
    description: `Secured keys both jwt and apikey used for request validation`,
  })
  public keys = new SecurityKeys();
}

export class KeyVerfication {
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

/**
 * AuthorizeResponse
 * representation of data sent by the server after request authentication
 * an to be verifed through otp or email
 */
export class AuthorizeResponse {
  /** the id for login request to be matched with the otp */
  public loginId: string;

  /** the time duration when the otp is expired */
  public expires: number;
}

/** format structure of key to send for keys verification */
export class KeyVerification {
  /** the format can either be JWT or APIKEY */
  public format: string;

  /** the actual key to be verified */
  public key: string;
}
