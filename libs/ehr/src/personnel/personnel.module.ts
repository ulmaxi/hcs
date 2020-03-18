import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EHRDataServiceModule } from '../data-layer/ehr-data.module';
import { PersonnelService } from './personel.service';
import { StaffManagmentService } from './staff-management.service';
import { PersonelController } from './staff-managment.controller';
import { MicroService, Queues, AMQ_URL } from '@ulmax/microservice/shared';

/**
 * responsible for staff managment to the API service
 */
@Module({
  imports: [
    EHRDataServiceModule,
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
  ],
  controllers: [PersonelController],
  providers: [PersonnelService, StaffManagmentService],
  exports: [PersonnelService],
})
export class EHRpersonnelModule {}
