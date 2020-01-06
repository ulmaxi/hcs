import { AuthorizedPipe } from '@eagle/authentication';
import { microServiceToken } from '@eagle/server-shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunalData } from './models/comunal-data.entity';
import { PersonalBiodata } from './models/personal-biodata.entity';
import { CommunalDataService } from './services/communal-data.service';
import { PersonalBiodataService } from './services/person-biodata.service';

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
})
export class UsersAdmininistrationModule {}
