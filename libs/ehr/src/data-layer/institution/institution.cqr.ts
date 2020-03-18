import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Institution } from './institution.entity';
import { InstitutionService } from './institution.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Institution>('ehr', 'institution');

export const InstitutionCQRActions = CQR.Actions;
export const InstitutionCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class InstitutionCQRService extends CQR.ModelClass {
  constructor(svc: InstitutionService) {
    super(svc.repository);
  }
}
