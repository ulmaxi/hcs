import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';
import { EHRDataServiceModule } from '../data-layer/ehr-data.module';
import { ConsultationShapshotService } from './consultation-snapshot.service';
import { FieldSnaphotService } from './subfields/fields-snapshot.service';
import { PersonalDataSnaphotService } from './subfields/personal-data.service';

@Module({
  imports: [EHRDataServiceModule, ClientsModule.register([
    { name: microServiceToken, transport: Transport.TCP },
  ])],
  controllers: [],
  providers: [ConsultationShapshotService, FieldSnaphotService, PersonalDataSnaphotService],
})
export class EHRHistorySnaphotModule { }
