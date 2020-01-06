import { AuthenticationModule, AuthorizedPipe, SuperAdminAuthenticationModule } from '@eagle/authentication';
import { DataAccessRecordsModule } from '@eagle/data-access-records';
import { EHRDataControllerModule, EHRHistorySnaphotModule, EHRMedicalClaimModule, EHRpersonnelModule } from '@eagle/ehr';
import { EHRHistoryModule } from '@eagle/ehr-intercom';
import { GeneralPublicDataControllerModule, GeneralPublicModule } from '@eagle/general-public';
import { MessagingModule } from '@eagle/messaging';
import { MessageEvents, microServiceToken, SendSMSEvent } from '@eagle/server-shared';
import { SuperUsersAdmininistrationModule, UsersAdmininistrationModule } from '@eagle/users-admininistration';
import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';
// import { SipAdminModule, SipModule } from '@eagle/sip';
import { join } from 'path';
import { AppController } from './app.controller';
import { routes } from './app.routes';
import { AppService } from './app.service';
import { configDatabase } from './db-config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // SipModule,
    // SipAdminModule,
    AuthenticationModule,
    SuperAdminAuthenticationModule,
    DataAccessRecordsModule,
    SuperUsersAdmininistrationModule,
    UsersAdmininistrationModule,
    MessagingModule,
    EHRDataControllerModule,
    GeneralPublicDataControllerModule,
    EHRMedicalClaimModule,
    EHRHistorySnaphotModule,
    EHRpersonnelModule,
    EHRHistoryModule,
    GeneralPublicModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
    RouterModule.forRoutes(routes),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, AuthorizedPipe],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @Inject(microServiceToken) private readonly client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    // const c = await this.client.connect();
    const a = await this.client
      .emit(MessageEvents.SMS, new SendSMSEvent('clientPhoneNo', 'message'))
      .toPromise();
    console.log(a);
    console.log(
      `-------------------------${new Date()}------------------------------------`,
    );
  }
}
