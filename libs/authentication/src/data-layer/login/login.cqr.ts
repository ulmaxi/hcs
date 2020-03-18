import { Injectable } from '@nestjs/common';
import { createModelCQR } from '@ulmax/microservice/modelCQR';
import { Login } from './login.entity';
import { LoginService } from './login.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Login>('authorization', 'login');

export const LoginCQRActions = CQR.Actions;
export const LoginCQREvents = CQR.Events;

/**
 * injectable service for PersonalBiodatCQR
 */
@Injectable()
export class LoginCQRService extends CQR.ModelClass {
  constructor(svc: LoginService) {
    super(svc.repository);
  }
}
