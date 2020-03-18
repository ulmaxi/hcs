import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Authorization } from './author.entity';
import { AuthorService } from './author.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Authorization>('authorization', 'authorization');

export const AuthorizationCQRActions = CQR.Actions;
export const AuthorizationCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class AuthorizationCQRService extends CQR.ModelClass {
  constructor(svc: AuthorService) {
    super(svc.repository);
  }
}
