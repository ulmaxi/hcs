import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { UlmaxCard } from './card.entity';
import { UlmaxCardService } from './card.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<UlmaxCard>('cardnode', 'ulmax-card');

export const UlmaxCardCQRActions = CQR.Actions;
export const UlmaxCardCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class UlmaxCardCQRService extends CQR.ModelClass {
  constructor(svc: UlmaxCardService) {
    super(svc.repository);
  }
}
