import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authorization/authorizer/authentication.controller';
import { AuthorizeAlertService } from './authorization/authorizer/authorize-alert.service';
import { AuthorizeRequestService } from './authorization/authorizer/authorize-req.service';
import { AuthorizedEventService } from './authorization/validator/authorized-events.service';
import { ValidateAuthorizedService } from './authorization/validator/validate-author.service';
import { Authorization } from './data-layer/author/author.entity';
import { AuthorService } from './data-layer/author/author.service';
import { Login } from './data-layer/login/login.entity';
import { LoginService } from './data-layer/login/login.service';
import { LoginCQRService } from './data-layer/login/login.cqr';
import { AuthorizationCQRService } from './data-layer/author/author.cqr';
import { AMQ_URL, Queues, MicroService } from '@ulmax/microservice/shared';

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
    ClientsModule.register([
      {
        name: MicroService.Authorization,
        transport: Transport.RMQ,
        options: {
          urls: [AMQ_URL],
          queue: Queues.Authorization,
        },
      },
      {
        name: MicroService.Admin,
        transport: Transport.RMQ,
        options: {
          urls: [AMQ_URL],
          queue: Queues.Admin,
        },
      },
    ]),
  ],
  providers: [
    AuthorService,
    LoginService,
    AuthorizeAlertService,
    AuthorizeRequestService,
    ValidateAuthorizedService,
    Logger,
    AuthorizedEventService,
    LoginCQRService,
    AuthorizationCQRService,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {
  constructor() {}
}
