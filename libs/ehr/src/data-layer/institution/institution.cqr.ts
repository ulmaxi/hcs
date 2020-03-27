import { Injectable, Controller } from '@nestjs/common';
import { createModelCQR, CreateModelItem, UpdateModelItem, RetriveEventQuery, FindEventQuery, DeleteEventQuery } from '@ulmax/microservice/modelCQR';
import { Institution } from './institution.entity';
import { InstitutionService } from './institution.service';
import { MessagePattern } from '@nestjs/microservices';

/**
 * creating the CQR Objects from the factories
 */
const CQR = createModelCQR<Institution>('ehr', 'institution');

export const InstitutionCQRActions = CQR.Actions;
export const InstitutionCQREvents = CQR.Events;

const { create, update, remove, retrieve, find } = InstitutionCQRActions;

/**
 * injectable service for PersonalBiodatCQR
 */
@Controller()
export class InstitutionCQRController extends CQR.ModelClass {
  constructor(svc: InstitutionService) {
    super(svc.repository);
  }
   /**
   * saves the item
   */
  @MessagePattern(create)
  create(item: CreateModelItem<Institution>) {
    return super.create(item);
  }

  /**
   * updates the item
   */
  @MessagePattern(update)
  update(item: UpdateModelItem<Institution>) {
    return super.update(item);
  }

  /**
   * retrieves the item
   */
  @MessagePattern(retrieve)
  retrieve(item: RetriveEventQuery<Institution>) {
    return super.retrieve(item);
  }

  /**
   * finds the item
   */
  @MessagePattern(find)
  find(item: FindEventQuery<Institution>) {
    return super.find(item)
  }

  /**
   * removes the item
   */
  @MessagePattern(remove)
  async remove(item: DeleteEventQuery<Institution>) {
    return super.remove(item)
  }

}
