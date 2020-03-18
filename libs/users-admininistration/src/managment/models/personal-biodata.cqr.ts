import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { PersonalBiodata } from './personal-biodata.entity';
import { Injectable } from '@nestjs/common';
import { PersonalBiodataService } from '../services/person-biodata.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<PersonalBiodata>(
  'users-management',
  'personal-biodata',
);

export const PersonalBiodataCQRActions = CQR.Actions;
export const PersonalBiodataCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class PersonalBiodataCQRService extends CQR.ModelClass {
  constructor(svc: PersonalBiodataService) {
    super(svc.repository);
  }
}
