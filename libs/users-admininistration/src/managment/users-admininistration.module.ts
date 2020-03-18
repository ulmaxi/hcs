import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPipe } from '@ulmax/authentication';
import { MicroserviceModule, ModelMicroService } from '@ulmax/microservice';
import { microServiceToken } from '@ulmax/server-shared';
import { CommunalData } from './models/comunal-data.entity';
import { PersonalBiodata } from './models/personal-biodata.entity';
import { CommunalDataService } from './services/communal-data.service';
import { PersonalBiodataService } from './services/person-biodata.service';
import { PersonalBiodataCQRService, CommunalDataCQRService } from '..';

const models = [CommunalData, PersonalBiodata];

@Module({
  imports: [
    TypeOrmModule.forFeature(models),
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [
    CommunalDataService,
    PersonalBiodataService,
    AuthorizedPipe,
    PersonalBiodataCQRService,
    CommunalDataCQRService,
  ],
})
export class UsersAdmininistrationModule {
  constructor() {}
}
