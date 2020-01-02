import { Module } from '@nestjs/common';
import { EHRDataServiceModule } from '../data-layer/ehr-data.module';
import { PersonnelService } from './personel.service';
import { StaffManagmentService } from './staff-management.service';
import { PersonelController } from './staff-managment.controller';

/**
 * responsible for staff managment to the API service
 */
@Module({
  imports: [EHRDataServiceModule],
  controllers: [PersonelController],
  providers: [PersonnelService, StaffManagmentService ],
  exports: [PersonnelService],
})
export class EHRpersonnelModule {}
