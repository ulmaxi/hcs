import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Consultation } from './consultation.entity';
import { ConsultationService } from './consultation.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Consultation>('ehr', 'consultation');

export const ConsultationCQRActions = CQR.Actions;
export const ConsultationCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class ConsultationCQRService extends CQR.ModelClass {
  constructor(svc: ConsultationService) {
    super(svc.repository);
  }
}
