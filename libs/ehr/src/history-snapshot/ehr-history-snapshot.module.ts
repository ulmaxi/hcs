import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';
import { EHRDataServiceModule } from '../data-layer/ehr-data.module';
import { ConsultationShapshotService } from './consultation-snapshot.service';
import { FieldSnaphotService } from './subfields/fields-snapshot.service';
import { PersonalDataSnaphotService } from './subfields/personal-data.service';
import { MicroService, AMQ_URL, Queues } from '@ulmax/microservice/shared';

@Module({
  imports: [
    EHRDataServiceModule,
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
        name: MicroService.Users,
        transport: Transport.RMQ,
        options: {
          urls: [AMQ_URL],
          queue: Queues.Users,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    ConsultationShapshotService,
    FieldSnaphotService,
    PersonalDataSnaphotService,
  ],
})
export class EHRHistorySnaphotModule {}
