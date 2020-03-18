import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Prescription } from './prescription.entity';
import { PrescriptionService } from './prescription.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Prescription>('ehr', 'prescription');

export const PrescriptionCQRActions = CQR.Actions;
export const PrescriptionCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class PrescriptionCQRService extends CQR.ModelClass {
  constructor(svc: PrescriptionService) {
    super(svc.repository);
  }
}
