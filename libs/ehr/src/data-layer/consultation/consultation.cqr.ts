import { Injectable, Controller } from '@nestjs/common';
import { createModelCQR, CreateModelItem, UpdateModelItem, RetriveEventQuery, FindEventQuery, DeleteEventQuery } from '@ulmax/microservice/modelCQR';
import { Consultation } from './consultation.entity';
import { ConsultationService } from './consultation.service';
import { MessagePattern } from '@nestjs/microservices';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Consultation>('ehr', 'consultation');

export const ConsultationCQRActions = CQR.Actions;
export const ConsultationCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = ConsultationCQRActions;


/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class ConsultationCQRController extends CQR.ModelClass {
  constructor(svc: ConsultationService) {
    super(svc.repository);
  }

   /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Consultation>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Consultation>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Consultation>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Consultation>) {
    return super.find(item)
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Consultation>) {
    return super.remove(item)
  }

}
