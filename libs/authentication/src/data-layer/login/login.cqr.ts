import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { createModelCQR, CreateModelItem, DeleteEventQuery, FindEventQuery, RetriveEventQuery, UpdateModelItem } from '@ulmax/microservice/modelCQR';
import { Login } from './login.entity';
import { LoginService } from './login.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Login>('authorization', 'login');

export const LoginCQRActions = CQR.Actions;
export const LoginCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = LoginCQRActions;

/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class LoginCQRController extends CQR.ModelClass {
  constructor(svc: LoginService) {
    super(svc.repository);
  }
  /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Login>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Login>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Login>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Login>) {
    return super.find(item);
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Login>) {
    return super.remove(item);
  }
}
