import { SuperAdminAuthorizeService } from '../services/super-admin.service';
import { AuthorizeRequest } from '@eagle/generated';
import { Body, Controller, HttpCode, Post, Req, Request } from '@nestjs/common';

/**
 * Responsible for authenticating and creating super admins
 */
@Controller('internal/auth')
export class SuperAdminAuthorizationController {
  constructor(private adminAuth: SuperAdminAuthorizeService) {}

  @Post('create')
  @HttpCode(201)
  createAdmin(@Req() req: Request, @Body() body: AuthorizeRequest) {
    return this.adminAuth.signupAdmin(req.headers.get('EAGLE-APIKEY'), body);
  }
}
