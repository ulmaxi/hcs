import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { createModelCQR, CreateModelItem, DeleteEventQuery, FindEventQuery, RetriveEventQuery, UpdateModelItem } from '@ulmax/microservice/modelCQR';
import { UlmaxCard } from './card.entity';
import { UlmaxCardService } from './card.service';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<UlmaxCard>('cardnode', 'ulmax-card');

export const UlmaxCardCQRActions = CQR.Actions;
export const UlmaxCardCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = UlmaxCardCQRActions;

/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class UlmaxCardCQRController extends CQR.ModelClass {
  constructor(svc: UlmaxCardService) {
    super(svc.repository);
  }

  /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<UlmaxCard>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<UlmaxCard>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<UlmaxCard>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<UlmaxCard>) {
    return super.find(item);
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<UlmaxCard>) {
    return super.remove(item);
  }
}
