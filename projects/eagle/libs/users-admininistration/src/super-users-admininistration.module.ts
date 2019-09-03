import { Module } from '@nestjs/common';
import { CommunalDataService } from './services/communal-data.service';
import { PersonalBiodataService } from './services/person-biodata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalBiodata } from './models/personal-biodata.entity';
import { CommunalData } from './models/comunal-data.entity';
import { CommunalDataController } from './controllers/communal-data.controller';
import { PersonalBiodataController } from './controllers/personal-biodata.controller';
import { AuthorizedPipe, microServiceToken } from '@eagle/server-shared';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunalData, PersonalBiodata]),
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [CommunalDataService, PersonalBiodataService, AuthorizedPipe],
  controllers: [CommunalDataController, PersonalBiodataController],
})
export class SuperUsersAdmininistrationModule {}
