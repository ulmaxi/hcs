import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';
import { EHRDataServiceModule } from '../data-layer/ehr-data.module';
import { PersonnelService } from './personel.service';
import { StaffManagmentService } from './staff-management.service';
import { PersonelController } from './staff-managment.controller';

/**
 * responsible for staff managment to the API service
 */
@Module({
  imports: [EHRDataServiceModule, ClientsModule.register([
    {
      name: microServiceToken,
      transport: Transport.TCP,
    },
  ])],
  controllers: [PersonelController],
  providers: [PersonnelService, StaffManagmentService],
  exports: [PersonnelService],
})
export class EHRpersonnelModule { }
