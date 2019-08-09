import { Authorization } from './models/author.entity';
import { Login } from './models/login.entity';
import { AuthorService } from './services/author.service';
import { AuthorizeAlertService } from './services/authorize-alert.service';
import { AuthorizeRequestService } from './services/authorize-req.service';
import { LoginService } from './services/login.service';
import { SuperAdminAuthorizeService } from './services/super-admin.service';
import { ValidateAuthorizedService } from './services/validate-author.service';
import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminAuthorizationController } from './controllers/super-admin.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// key settings for jwt token
const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;

/**
 * This module contains authentication for various entities
 * and managers super admisn details also
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Login, Authorization]),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: JWT_EXPIRES || '60s' },
    }),
  ],
  providers: [
    AuthorService,
    LoginService,
    AuthorizeAlertService,
    AuthorizeRequestService,
    SuperAdminAuthorizeService,
    ValidateAuthorizedService,
    Logger,
  ],
  controllers: [SuperAdminAuthorizationController, AuthenticationController],
})
export class AuthenticationModule implements OnModuleInit {
  constructor(
    private admin: SuperAdminAuthorizeService,
    private logger: Logger,
  ) {}

  async onModuleInit() {
    const newAdmin = await this.admin.createInitalAdmin();
    this.logger.log(`Eagle Super is created ${newAdmin.identification}`);
  }
}
