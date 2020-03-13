import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { microServiceToken } from '@ulmax/server-shared';
import { AuthorizedEventService } from './authorization/validator/authorized-events.service';
import { AuthorController } from './data-layer/author/author.controller';
import { Authorization } from './data-layer/author/author.entity';
import { AuthorService } from './data-layer/author/author.service';
import { LoginController } from './data-layer/login/login.controller';
import { Login } from './data-layer/login/login.entity';
import { LoginService } from './data-layer/login/login.service';
import { SuperAdminAuthorizationController } from './superadmin/super-admin.controller';
import { SuperAdminAuthorizeService } from './superadmin/super-admin.service';

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
  providers: [
    AuthorService,
    AuthorizedEventService,
    LoginService,
    SuperAdminAuthorizeService,
    Logger,
  ],
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
  ) { }

  async onModuleInit() {
    const newAdmin = await this.admin.createInitalAdmin();
    this.logger.log(`Eagle Super is created ${newAdmin.identification}`);
  }
}
