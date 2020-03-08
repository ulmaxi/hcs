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
    MicroserviceModule,
  ],
  providers: [CommunalDataService, PersonalBiodataService, AuthorizedPipe],
})
export class UsersAdmininistrationModule {
  constructor(private MRPC: ModelMicroService, private moduleRf: ModuleRef) {
    this.MRPC.register(
      PersonalBiodata,
      this.moduleRf.get(PersonalBiodataService).repository,
    );
    this.MRPC.register(
      CommunalData,
      this.moduleRf.get(CommunalDataService).repository,
    );
  }
}
