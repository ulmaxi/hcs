import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPipe } from '@ulmax/authentication';
import { CommunalData } from './models/comunal-data.entity';
import { PersonalBiodata } from './models/personal-biodata.entity';
import { CommunalDataService } from './services/communal-data.service';
import { PersonalBiodataService } from './services/person-biodata.service';
import { CommunalDataController } from './controllers/communal-data.controller';
import { PersonalBiodataController } from './controllers/personal-biodata.controller';
import { MicroService, Queues, AMQ_URL } from '@ulmax/microservice/shared';
import { PersonalBiodataCQRService } from './models/personal-biodata.cqr';
import { CommunalDataCQRService } from './models/communal-data.cqr';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MicroService.Authorization,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Authorization,
          urls: [AMQ_URL],
        },
      },
    ]),
    TypeOrmModule.forFeature([CommunalData, PersonalBiodata]),
  ],
  providers: [
    CommunalDataService,
    PersonalBiodataService,
    AuthorizedPipe,
    PersonalBiodataCQRService,
    CommunalDataCQRService,
  ],
  controllers: [CommunalDataController, PersonalBiodataController],
})
export class UsersAdmininistrationModule {
  constructor() {}
}
