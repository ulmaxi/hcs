import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { createModelCQR, CreateModelItem, DeleteEventQuery, FindEventQuery, RetriveEventQuery, UpdateModelItem } from '@ulmax/microservice/modelCQR';
import { Authorization } from './author.entity';
import { AuthorService } from './author.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Authorization>('authorization', 'authorization');

export const AuthorizationCQRActions = CQR.Actions;
export const AuthorizationCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = AuthorizationCQRActions;
/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class AuthorizationCQRController extends CQR.ModelClass {
  constructor(svc: AuthorService) {
    super(svc.repository);
  }

  /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Authorization>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Authorization>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Authorization>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Authorization>) {
    return super.find(item);
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Authorization>) {
    return super.remove(item);
  }
}
