import { Authorization } from './models/author.entity';
import { Login } from './models/login.entity';
import { AuthorService } from './services/author.service';
import { LoginService } from './services/login.service';
import { SuperAdminAuthorizeService } from './services/super-admin.service';
import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminAuthorizationController } from './controllers/super-admin.controller';
import { LoginController } from './controllers/login.controller';
import { AuthorController } from './controllers/author.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@eagle/server-shared';

/**
 * This module contains authentication for various entities
 * and managers super admisn details also
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Login, Authorization]),
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [AuthorService, LoginService, SuperAdminAuthorizeService, Logger],
  controllers: [
    SuperAdminAuthorizationController,
    LoginController,
    AuthorController,
  ],
})
export class SuperAdminAuthenticationModule implements OnModuleInit {
  constructor(
    private admin: SuperAdminAuthorizeService,
    private logger: Logger,
  ) {}

  async onModuleInit() {
    const newAdmin = await this.admin.createInitalAdmin();
    this.logger.log(`Eagle Super is created ${newAdmin.identification}`);
  }
}
