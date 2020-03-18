import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Injectable } from '@nestjs/common';
import { CommunalData } from './comunal-data.entity';
import { CommunalDataService } from '../services/communal-data.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<CommunalData>('users-management', 'communal-data');

export const CommunalDataCQRActions = CQR.Actions;
export const CommunalDataCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class CommunalDataCQRService extends CQR.ModelClass {
  constructor(svc: CommunalDataService) {
    super(svc.repository);
  }
}
