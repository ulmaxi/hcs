import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { Authorization } from '../models/author.entity';
import { Authorized } from '../pipes/auth.decorator';
import { SuperAdminAuthorizeService } from '../services/super-admin.service';
import { AuthorizeRequest } from './typecast';

/**
 * Responsible for authenticating and creating super admins
 */
@ApiUseTags('auth')
@Controller('superadmin')
export class SuperAdminAuthorizationController {
  constructor(private adminAuth: SuperAdminAuthorizeService) {}

  /**
   * signup and create a new user with superadmin right
   */
  @ApiOkResponse({ description: `Successfull creates other super admin` })
  @Post('create')
  @HttpCode(201)
  // @UsePipes(AuthorizedPipe)
  createAdmin(
    @Authorized() auth: Authorization,
    @Body() body: AuthorizeRequest,
  ) {
    return this.adminAuth.signupAdmin(auth.apiKey, body);
  }
}
