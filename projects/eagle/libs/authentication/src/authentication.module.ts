import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { microServiceToken } from '@ulmax/server-shared';
import { AuthenticationController } from './controllers/authentication.controller';
import { Authorization } from './models/author.entity';
import { Login } from './models/login.entity';
import { AuthorService } from './services/author.service';
import { AuthorizeAlertService } from './services/authorize-alert.service';
import { AuthorizeRequestService } from './services/authorize-req.service';
import { LoginService } from './services/login.service';
import { ValidateAuthorizedService } from './services/validate-author.service';

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
      { name: microServiceToken, transport: Transport.TCP },
    ]),
  ],
  providers: [
    AuthorService,
    LoginService,
    AuthorizeAlertService,
    AuthorizeRequestService,
    ValidateAuthorizedService,
    Logger,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {
  constructor() { }
}
