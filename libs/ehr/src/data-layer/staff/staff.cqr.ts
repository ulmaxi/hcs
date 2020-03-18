import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Staff>('ehr', 'staff');

export const StaffCQRActions = CQR.Actions;
export const StaffCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class StaffCQRService extends CQR.ModelClass {
  constructor(svc: StaffService) {
    super(svc.repository);
  }
}
