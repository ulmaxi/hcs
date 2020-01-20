import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { microServiceToken } from '@ulmax/server-shared';
import { AuthorController } from './controllers/author.controller';
import { LoginController } from './controllers/login.controller';
import { SuperAdminAuthorizationController } from './controllers/super-admin.controller';
import { Authorization } from './models/author.entity';
import { Login } from './models/login.entity';
import { AuthorService } from './services/author.service';
import { LoginService } from './services/login.service';
import { SuperAdminAuthorizeService } from './services/super-admin.service';

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
